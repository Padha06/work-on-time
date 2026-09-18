import { supabase } from "./supabase.js";

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "15551234567";

// ─── Requests ──────────────────────────────────────────────────────────────

/** Fetch all publicly visible requests with optional filters */
export async function getOpenRequests({ serviceType, urgency, search } = {}) {
  let q = supabase
    .from("service_requests")
    .select("id, title, service_type, location, urgency, description, budget, status, claim_count, created_at")
    .in("status", ["open", "in_progress", "completed"])
    .order("created_at", { ascending: false });

  if (serviceType && serviceType !== "All") q = q.eq("service_type", serviceType);
  if (urgency && urgency !== "All") q = q.eq("urgency", urgency);
  if (search) {
    // Escape LIKE wildcards so user input can't widen the match.
    const escaped = search.replace(/[\\%_]/g, (m) => `\\${m}`);
    q = q.ilike("title", `%${escaped}%`);
  }

  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

/** Fetch a single request by id with its images */
export async function getRequestById(id) {
  const [reqRes, imgRes] = await Promise.all([
    supabase.from("service_requests").select("*").eq("id", id).single(),
    supabase.from("request_images").select("image_url").eq("request_id", id),
  ]);
  if (reqRes.error) throw reqRes.error;
  return { ...reqRes.data, images: imgRes.data?.map((r) => r.image_url) || [] };
}

/** Submit a new service request */
export async function submitRequest(formData, imageFiles = []) {
  // Client-generated id: avoids INSERT+SELECT (RETURNING), which would
  // evaluate SELECT policies on the new 'pending' row and fail RLS for
  // anonymous users. INSERT policy (status='pending') still applies.
  const requestId = crypto.randomUUID();
  const { error } = await supabase
    .from("service_requests")
    .insert({
      id: requestId,
      title: `${formData.serviceType} — ${formData.location}`,
      service_type: formData.serviceType,
      location: formData.location,
      description: formData.description,
      urgency: formData.urgency,
      contact_name: formData.name,
      whatsapp_number: formData.whatsapp,
      budget: formData.budget || null,
      status: "pending",
    });

  if (error) throw error;

  // Upload images to Supabase Storage
  for (const file of imageFiles) {
    const ext = file.name.split(".").pop();
    const path = `${requestId}/${Date.now()}.${ext}`;
    const { data: upload, error: uploadErr } = await supabase.storage
      .from("request-images")
      .upload(path, file, { contentType: file.type });
    if (uploadErr) continue; // skip failed uploads but don't abort

    const { data: urlData } = supabase.storage.from("request-images").getPublicUrl(upload.path);
    await supabase.from("request_images").insert({ request_id: requestId, image_url: urlData.publicUrl });
  }

  return requestId;
}

// ─── Claims ────────────────────────────────────────────────────────────────

/** Submit a provider claim */
export async function submitClaim(requestId, claimData) {
  // Same RLS reasoning as submitRequest: client-side id, no RETURNING.
  const claimId = crypto.randomUUID();
  const { error } = await supabase
    .from("claims")
    .insert({
      id: claimId,
      request_id: requestId,
      provider_name: claimData.name,
      whatsapp_number: claimData.whatsapp,
      years_experience: claimData.experience ? Number(claimData.experience) : null,
      portfolio_url: claimData.portfolio || null,
      background: claimData.background,
      status: "pending",
    });

  if (error) throw error;
  return claimId;
}

// ─── WhatsApp ──────────────────────────────────────────────────────────────

/** Build a wa.me deep-link for a provider claiming a request */
export function buildClaimWhatsAppLink(request, provider) {
  const shortId = request.id.slice(0, 8).toUpperCase();
  const msg = [
    `Hello, my name is ${provider.name}. I am interested in your ${request.service_type} request #${shortId}.`,
    ``,
    `I have ${provider.experience || "several"} years of experience and specialize in ${provider.background}.`,
    ``,
    `I would be happy to discuss the work, pricing and availability.`,
    ``,
    `Work On Time Request: ${request.title}`,
    `Location: ${request.location}`,
    `Urgency: ${request.urgency.toUpperCase()}`,
  ].join("\n");

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/** Build a wa.me link for existing quote buttons */
export function buildQuoteWhatsAppLink(service = "your services") {
  const msg = `Hi, I saw your new site and I'm interested in ${service}. Please send me a quote.`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

// ─── Admin ─────────────────────────────────────────────────────────────────

/** Get all requests for admin (all statuses) */
export async function adminGetAllRequests({ status, serviceType, search } = {}) {
  let q = supabase
    .from("service_requests")
    .select("*, claims(count)")
    .order("created_at", { ascending: false });

  if (status && status !== "All") q = q.eq("status", status);
  if (serviceType && serviceType !== "All") q = q.eq("service_type", serviceType);
  if (search) q = q.ilike("title", `%${search}%`);

  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

/** Approve a pending request */
export async function approveRequest(id) {
  const { error } = await supabase
    .from("service_requests")
    .update({ status: "open", approved_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

/** Reject a pending request */
export async function rejectRequest(id) {
  const { error } = await supabase.from("service_requests").update({ status: "rejected" }).eq("id", id);
  if (error) throw error;
}

/** Change request status */
export async function updateRequestStatus(id, status) {
  const updates = { status };
  if (status === "open") updates.approved_at = new Date().toISOString();
  if (status === "completed") updates.completed_at = new Date().toISOString();
  const { error } = await supabase.from("service_requests").update(updates).eq("id", id);
  if (error) throw error;
}

/** Get all claims for admin */
export async function adminGetAllClaims({ status, requestId } = {}) {
  let q = supabase
    .from("claims")
    .select("*, service_requests(title, service_type, location, status)")
    .order("created_at", { ascending: false });

  if (status && status !== "All") q = q.eq("status", status);
  if (requestId) q = q.eq("request_id", requestId);

  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

/** Assign a claim (mark as assigned, update request to in_progress) */
export async function assignClaim(claimId, requestId) {
  const { error: e1 } = await supabase
    .from("claims")
    .update({ status: "assigned", assigned_at: new Date().toISOString() })
    .eq("id", claimId);
  const { error: e2 } = await supabase.from("service_requests").update({ status: "in_progress" }).eq("id", requestId);
  if (e1) throw e1;
  if (e2) throw e2;
}

/** Mark claim as completed */
export async function completeClaim(claimId, requestId) {
  const { error: e1 } = await supabase
    .from("claims")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", claimId);
  const { error: e2 } = await supabase
    .from("service_requests")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", requestId);
  if (e1) throw e1;
  if (e2) throw e2;
}

/** Get analytics data */
export async function getAnalytics() {
  const [reqs, cls] = await Promise.all([
    supabase.from("service_requests").select("id, status, service_type, created_at, completed_at, approved_at"),
    supabase.from("claims").select("id, request_id, status, created_at, whatsapp_number"),
  ]);
  if (reqs.error) throw reqs.error;
  if (cls.error) throw cls.error;

  const requests = reqs.data || [];
  const claims = cls.data || [];

  const total = requests.length;
  const open = requests.filter((r) => r.status === "open").length;
  const inProgress = requests.filter((r) => r.status === "in_progress").length;
  const completed = requests.filter((r) => r.status === "completed").length;
  const totalClaims = claims.length;
  const avgClaims = total > 0 ? (totalClaims / total).toFixed(1) : 0;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Unique providers by WhatsApp number
  const activeProviders = new Set(claims.map((c) => c.whatsapp_number)).size;
  // Unique seekers by request
  const seekerRequests = requests.filter((r) => r.status !== "pending");
  const activeSeekers = seekerRequests.length;

  // Average time to complete (days)
  const completedWithTime = requests.filter((r) => r.status === "completed" && r.approved_at && r.completed_at);
  const avgDays =
    completedWithTime.length > 0
      ? Math.round(
          completedWithTime.reduce((sum, r) => {
            const diff = new Date(r.completed_at) - new Date(r.approved_at);
            return sum + diff / (1000 * 60 * 60 * 24);
          }, 0) / completedWithTime.length
        )
      : null;

  // By service type
  const byType = requests.reduce((acc, r) => {
    acc[r.service_type] = (acc[r.service_type] || 0) + 1;
    return acc;
  }, {});
  const byTypeChart = Object.entries(byType).map(([name, value]) => ({ name, value }));

  // Status breakdown
  const statusBreakdown = ["pending", "open", "in_progress", "completed", "rejected"].map((s) => ({
    name: s.replace("_", " "),
    value: requests.filter((r) => r.status === s).length,
  }));

  // Requests over last 30 days
  const now = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });
  const requestsByDay = days.map((day) => ({
    date: day,
    requests: requests.filter((r) => r.created_at?.startsWith(day)).length,
    claims: claims.filter((c) => c.created_at?.startsWith(day)).length,
  }));

  return {
    total, open, inProgress, completed, totalClaims, avgClaims,
    completionRate, activeProviders, activeSeekers, avgDays,
    byTypeChart, statusBreakdown, requestsByDay,
  };
}

// ==========================================
// PORTFOLIO (ADMIN & PUBLIC)
// ==========================================

export async function getPortfolioItems() {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addPortfolioItem(form, file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("portfolio")
    .upload(fileName, file);
    
  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from("portfolio")
    .getPublicUrl(fileName);

  const isVideo = file.type.startsWith('video/');

  const { error } = await supabase.from("portfolio_items").insert([{
    title: form.title,
    category: form.category,
    media_url: publicUrl,
    media_type: isVideo ? 'video' : 'image'
  }]);

  if (error) throw error;
}

export async function deletePortfolioItem(id, mediaUrl) {
  const { error: dbError } = await supabase.from("portfolio_items").delete().eq("id", id);
  if (dbError) throw dbError;

  try {
    const urlParts = mediaUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    await supabase.storage.from("portfolio").remove([fileName]);
  } catch (e) {
    console.error("Failed to delete file", e);
  }
}

