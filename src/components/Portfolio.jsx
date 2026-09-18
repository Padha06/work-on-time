import { useState, useEffect } from "react";
import SampleTag from "./SampleTag.jsx";
import { getPortfolioItems } from "../lib/marketplace.js";

const TABS = ["All", "Furniture Repair", "Custom Furniture", "Aluminum Doors", "Sliding Doors", "Restoration", "Other"];

export default function Portfolio() {
  const [tab, setTab] = useState("All");
  const [light, setLight] = useState(null);
  const [dbItems, setDbItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolioItems().then(data => {
      setDbItems(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const items = dbItems.filter((p) => tab === "All" || p.category === tab);

  // Lightbox overlay UX: Esc closes, background scroll locks while open.
  useEffect(() => {
    if (!light) return;
    const onKey = (e) => { if (e.key === "Escape") setLight(null); };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("lightbox-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("lightbox-open");
    };
  }, [light]);
  
  // Only show tabs that actually have items (plus All)
  const activeCategories = ["All", ...new Set(dbItems.map(i => i.category))];
  const tabsToShow = TABS.filter(t => activeCategories.includes(t));

  return (
    <section id="work" className="section-pad bg-white">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Recent work</p>
            <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight text-charcoal md:text-5xl">A wall of finished jobs.</h2>
          </div>
          <SampleTag />
        </div>
        
        {loading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading portfolio">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-charcoal/10 bg-white">
                <div className="h-48 bg-charcoal/10" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 rounded bg-charcoal/10" />
                  <div className="h-3 w-1/2 rounded bg-charcoal/8" />
                </div>
              </div>
            ))}
          </div>
        ) : dbItems.length === 0 ? (
          <div className="mt-12 py-12 text-center rounded-2xl bg-charcoal/5">
            <span className="text-3xl block mb-2">🖼️</span>
            <p className="font-semibold text-charcoal">Portfolio is empty</p>
            <p className="text-sm text-graphite mt-1">Admin needs to upload recent works.</p>
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter portfolio">
              {tabsToShow.map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`inline-flex min-h-[44px] items-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${tab === t ? "bg-charcoal text-white" : "bg-charcoal/5 text-graphite hover:bg-charcoal/10"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <div className="mt-8 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
              {items.map((p) => (
                <button key={p.id} onClick={() => setLight(p)} className="reveal group block w-full overflow-hidden rounded-2xl border border-charcoal/10 text-left bg-charcoal/5">
                  <div className="relative overflow-hidden">
                    {p.media_type === 'video' ? (
                      <video src={p.media_url} className="w-full object-cover transition duration-500 group-hover:scale-105" muted loop playsInline onMouseEnter={e => e.target.play()} onMouseLeave={e => e.target.pause()} />
                    ) : (
                      <img src={p.media_url} alt={p.title} loading="lazy" className="w-full object-cover transition duration-500 group-hover:scale-105" />
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">{p.category}</span>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="font-semibold text-charcoal">{p.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {light && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4" onClick={() => setLight(null)} role="dialog" aria-label="Lightbox">
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between gap-3 text-white">
              <h3 className="font-display text-2xl font-semibold">{light.title}</h3>
              <button onClick={() => setLight(null)} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition" aria-label="Close">✕</button>
            </div>
            {light.media_type === 'video' ? (
              <video src={light.media_url} controls autoPlay className="h-auto w-full max-h-[80vh] rounded-2xl shadow-2xl" />
            ) : (
              <img src={light.media_url} alt={light.title} className="h-auto w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl" />
            )}
            <p className="mt-3 text-center text-sm font-semibold tracking-widest text-white/50 uppercase">{light.category}</p>
          </div>
        </div>
      )}
    </section>
  );
}
