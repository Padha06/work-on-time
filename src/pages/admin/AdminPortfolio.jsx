import { useState, useEffect } from "react";
import { getPortfolioItems, addPortfolioItem, deletePortfolioItem } from "../../lib/marketplace.js";

const CATEGORIES = ["Furniture Repair", "Custom Furniture", "Aluminum Doors", "Sliding Doors", "Restoration", "Other"];

export default function AdminPortfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await getPortfolioItems().catch(() => []);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a file.");
    if (file.size > 20 * 1024 * 1024) return setError("File must be less than 20MB.");
    
    setError("");
    setUploading(true);
    try {
      await addPortfolioItem({ title, category }, file);
      // Reset form
      setTitle("");
      setCategory(CATEGORIES[0]);
      setFile(null);
      document.getElementById("portfolio-file-input").value = "";
      await load();
    } catch (err) {
      setError(err.message || "Upload failed. Did you create the 'portfolio' storage bucket?");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, mediaUrl) => {
    if (!window.confirm("Are you sure you want to delete this portfolio item?")) return;
    try {
      await deletePortfolioItem(id, mediaUrl);
      await load();
    } catch (err) {
      alert("Failed to delete item: " + err.message);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-charcoal mb-6">Manage Portfolio</h1>

      {/* Upload Form */}
      <div className="rounded-2xl bg-white border border-charcoal/8 p-6 shadow-sm mb-8">
        <h2 className="font-display text-lg font-semibold text-charcoal mb-4">Add New Work</h2>
        {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        
        <form onSubmit={handleUpload} className="grid gap-4 md:grid-cols-2 items-start">
          <div className="grid gap-1.5">
            <label className="text-[13px] font-bold text-charcoal">Title</label>
            <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Modern Sliding Wardrobe"
              className="w-full rounded-xl border border-charcoal/15 px-4 py-3 text-[15px] outline-none focus:border-accent" />
          </div>
          
          <div className="grid gap-1.5">
            <label className="text-[13px] font-bold text-charcoal">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full rounded-xl border border-charcoal/15 px-4 py-3 text-[15px] outline-none focus:border-accent">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          
          <div className="grid gap-1.5 md:col-span-2">
            <label className="text-[13px] font-bold text-charcoal">Media (Photo or Video)</label>
            <input id="portfolio-file-input" required type="file" accept="image/*,video/mp4,video/webm" 
              onChange={e => setFile(e.target.files[0])}
              className="w-full rounded-xl border border-charcoal/15 px-4 py-2.5 text-[15px] outline-none file:mr-4 file:rounded-full file:border-0 file:bg-charcoal/5 file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-charcoal/10" />
            <p className="text-[11px] text-graphite/60">Images (JPG, PNG, WebP) or Videos (MP4, WebM) under 20MB.</p>
          </div>

          <div className="md:col-span-2">
            <button type="submit" disabled={uploading}
              className="rounded-full bg-accent px-8 py-3 text-[15px] font-bold text-white transition hover:brightness-110 disabled:opacity-60">
              {uploading ? "Uploading..." : "Publish to Portfolio"}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Items */}
      <div className="rounded-2xl bg-white border border-charcoal/8 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-charcoal/8">
          <h2 className="font-display text-lg font-semibold text-charcoal">Live Portfolio ({items.length})</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-graphite animate-pulse">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-graphite">No portfolio items yet. Add your first piece of work above!</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6">
            {items.map(item => (
              <div key={item.id} className="group relative rounded-xl border border-charcoal/10 overflow-hidden bg-charcoal/5">
                {item.media_type === 'video' ? (
                  <video src={item.media_url} className="h-40 w-full object-cover" muted loop playsInline onMouseEnter={e => e.target.play()} onMouseLeave={e => e.target.pause()} />
                ) : (
                  <img src={item.media_url} alt={item.title} className="h-40 w-full object-cover" />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-semibold text-sm leading-tight">{item.title}</p>
                  <p className="text-aluminum text-[10px] uppercase tracking-wider">{item.category}</p>
                  <button onClick={() => handleDelete(item.id, item.media_url)}
                    className="absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-red-500/90 text-white text-[10px] hover:bg-red-600">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
