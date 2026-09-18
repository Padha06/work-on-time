import { useState } from "react";
import { Link } from "react-router-dom";
import { submitRequest } from "../lib/marketplace.js";

const SERVICE_TYPES = [
  "Furniture Repair",
  "Custom Furniture",
  "Aluminum Doors",
  "Sliding Doors",
  "Restoration",
  "Other",
];

const URGENCY_OPTIONS = [
  { value: "high",   label: "High",   desc: "Needs attention within days" },
  { value: "medium", label: "Medium", desc: "Within 1–2 weeks" },
  { value: "low",    label: "Low",    desc: "Flexible timeline" },
];

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function PostRequestPage() {
  const [form, setForm] = useState({
    serviceType: SERVICE_TYPES[0],
    location: "",
    description: "",
    urgency: "medium",
    name: "",
    whatsapp: "",
    budget: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) => {
      if (!ALLOWED_TYPES.includes(f.type)) return false;
      if (f.size > MAX_FILE_SIZE) return false;
      return true;
    });
    const combined = [...images, ...valid].slice(0, MAX_FILES);
    setImages(combined);
    setImagePreviews(combined.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (i) => {
    const next = images.filter((_, idx) => idx !== i);
    setImages(next);
    setImagePreviews(next.map((f) => URL.createObjectURL(f)));
  };

  const validate = () => {
    const e = {};
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.description.trim() || form.description.length < 20) e.description = "Please describe the job in at least 20 characters";
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.whatsapp.trim()) e.whatsapp = "WhatsApp number is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setSubmitError("");
    try {
      await submitRequest(form, images);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="pt-16 min-h-[100dvh] bg-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6 py-20 text-center">
          <div className="mx-auto max-w-md">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100 text-4xl">✓</div>
            <h1 className="font-display mt-6 text-4xl font-semibold text-charcoal">Request Submitted Successfully</h1>
            <p className="mt-4 text-graphite">
              Your request has been submitted and is awaiting approval. Once approved, providers will be able to view and claim the work.
            </p>
            <p className="mt-2 text-sm text-graphite/60">
              You will hear from interested providers via WhatsApp once your request goes live.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/marketplace" className="rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white transition hover:brightness-110">
                Browse Marketplace
              </Link>
              <Link to="/" className="rounded-full border border-charcoal/15 px-6 py-3 text-[15px] font-semibold text-charcoal transition hover:bg-charcoal hover:text-white">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-3 text-base outline-none transition focus:border-accent ${
      errors[field] ? "border-red-400 bg-red-50" : "border-charcoal/15 bg-white"
    }`;

  return (
    <div className="pt-16 min-h-[100dvh] bg-cream">
      {/* Header */}
      <section className="bg-charcoal py-16 text-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal max-w-xl">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Post a Request</p>
            <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
              Describe your job.<br />
              <span className="text-aluminum">Providers will find you.</span>
            </h1>
            <p className="mt-3 text-cream/70">No account needed. Takes about 2 minutes.</p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-pad">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="rounded-3xl bg-white border border-charcoal/8 p-8 shadow-sm space-y-6" noValidate>
            {submitError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{submitError}</div>
            )}

            {/* Service Type */}
            <div className="grid gap-1.5">
              <label className="text-[13px] font-bold text-charcoal">Service Type *</label>
              <select value={form.serviceType} onChange={set("serviceType")}
                className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-base outline-none focus:border-accent">
                {SERVICE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Location */}
            <div className="grid gap-1.5">
              <label className="text-[13px] font-bold text-charcoal">Location / Address *</label>
              <input value={form.location} onChange={set("location")} placeholder="e.g. Bansdroni, Kolkata"
                className={inputClass("location")} />
              {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
            </div>

            {/* Description */}
            <div className="grid gap-1.5">
              <label className="text-[13px] font-bold text-charcoal">Describe the Job *</label>
              <textarea rows={5} value={form.description} onChange={set("description")}
                placeholder="What needs to be done? Include size, materials, condition, timeline…"
                className={`${inputClass("description")} resize-none`} />
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Urgency */}
            <div className="grid gap-1.5">
              <label className="text-[13px] font-bold text-charcoal">Urgency *</label>
              <div className="grid grid-cols-3 gap-3">
                {URGENCY_OPTIONS.map((opt) => (
                  <label key={opt.value} className={`cursor-pointer rounded-xl border-2 p-3 text-center transition ${
                    form.urgency === opt.value ? "border-accent bg-accent/5" : "border-charcoal/10 hover:border-charcoal/25"
                  }`}>
                    <input type="radio" name="urgency" value={opt.value} checked={form.urgency === opt.value}
                      onChange={set("urgency")} className="sr-only" />
                    <span className="block text-[15px] font-semibold text-charcoal">{opt.label}</span>
                    <span className="mt-0.5 block text-[11px] text-graphite">{opt.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <label className="text-[13px] font-bold text-charcoal">Full Name *</label>
                <input value={form.name} onChange={set("name")} placeholder="Your name"
                  className={inputClass("name")} />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>
              <div className="grid gap-1.5">
                <label className="text-[13px] font-bold text-charcoal">Phone / WhatsApp *</label>
                <input value={form.whatsapp} onChange={set("whatsapp")} placeholder="+254 7XX XXX XXX" inputMode="tel"
                  className={inputClass("whatsapp")} />
                {errors.whatsapp && <p className="text-sm text-red-600">{errors.whatsapp}</p>}
              </div>
            </div>

            {/* Photos */}
            <div className="grid gap-1.5">
              <label className="text-[13px] font-bold text-charcoal">
                Photos <span className="font-normal text-graphite/50">(optional, up to {MAX_FILES}, max 5MB each)</span>
              </label>
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative h-20 w-20">
                      <img src={src} alt="" className="h-full w-full rounded-lg object-cover" />
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] text-white shadow">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {images.length < MAX_FILES && (
                <label className="cursor-pointer rounded-xl border-2 border-dashed border-charcoal/20 p-6 text-center hover:border-accent transition">
                  <input type="file" multiple accept="image/*" onChange={handleImages} className="sr-only" />
                  <span className="text-3xl">📷</span>
                  <p className="mt-2 text-sm text-graphite">Click to upload photos</p>
                  <p className="text-[11px] text-graphite/50">JPEG, PNG, WebP — max 5MB each</p>
                </label>
              )}
            </div>

            {/* Budget */}
            <div className="grid gap-1.5">
              <label className="text-[13px] font-bold text-charcoal">
                Budget <span className="font-normal text-graphite/50">(optional)</span>
              </label>
              <input value={form.budget} onChange={set("budget")} placeholder="e.g. ₹8,000 flexible"
                className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-base outline-none focus:border-accent" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full rounded-full bg-accent py-4 text-[15px] font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-60">
              {loading ? "Submitting…" : "Submit for Approval →"}
            </button>
            <p className="text-center text-[12px] text-graphite/50">
              Your contact information is only shared with providers who claim your request. It won't be publicly visible.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
