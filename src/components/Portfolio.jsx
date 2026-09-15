import { useState } from "react";
import SampleTag from "./SampleTag.jsx";
import { PORTFOLIO } from "../data/content.js";

const TABS = ["All", "Furniture", "Doors"];

export default function Portfolio() {
  const [tab, setTab] = useState("All");
  const [light, setLight] = useState(null);
  const items = PORTFOLIO.filter((p) => tab === "All" || p.cat === tab);

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
        <div className="mt-6 flex gap-2" role="tablist" aria-label="Filter portfolio">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${tab === t ? "bg-charcoal text-white" : "bg-charcoal/5 text-graphite hover:bg-charcoal/10"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="mt-6 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
          {items.map((p) => (
            <button key={p.id} onClick={() => setLight(p)} className="reveal group block w-full overflow-hidden rounded-2xl border border-charcoal/10 text-left">
              <div className="relative overflow-hidden">
                <img src={p.img} alt={p.title} loading="lazy" className="w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">{p.cat}</span>
              </div>
              <div className="bg-white px-4 py-3 text-sm font-semibold text-charcoal">{p.title}</div>
            </button>
          ))}
        </div>
      </div>

      {light && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4"
          onClick={() => setLight(null)}
          role="dialog"
          aria-modal="true"
          aria-label={light.title}
        >
          <figure className="max-w-3xl overflow-hidden rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
            <img src={light.img} alt={light.title} className="max-h-[70vh] w-full object-cover" />
            <figcaption className="flex items-center justify-between gap-3 px-5 py-4">
              <span className="text-[15px] font-semibold text-charcoal">{light.title} <span className="ml-2"><SampleTag /></span></span>
              <button onClick={() => setLight(null)} className="rounded-full bg-charcoal px-4 py-2 text-sm font-semibold text-white" autoFocus>Close ✕</button>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
