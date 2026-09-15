import { Suspense, lazy, useState } from "react";
import SampleTag from "./SampleTag.jsx";
import { FINISHES, GLASS, waLink } from "../data/content.js";

const DoorStage = lazy(() => import("./DoorStage.jsx"));

export function DoorConfigurator({ frame, glass, openAmount = 0 }) {
  return (
    <Suspense fallback={<div className="grid h-full place-items-center text-graphite">Loading 3D…</div>}>
      <DoorStage frame={frame} glass={glass} openAmount={openAmount} />
    </Suspense>
  );
}

/** Section 5 — live swatch picker wired to the 3D configurator (spec 5.5 + stretch 6.5 merged). */
export default function FinishExplorer() {
  const [frame, setFrame] = useState(FINISHES[0]);
  const [glass, setGlass] = useState(GLASS[0]);
  const [opening, setOpening] = useState(0); // 0 = shut, 1 = wide open

  return (
    <section id="finishes" className="section-pad bg-cream">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="reveal max-w-2xl">
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Finish explorer</p>
          <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight text-charcoal md:text-5xl">
            Tap a swatch. Watch the door change.
          </h2>
          <p className="mt-3 text-graphite">Live 3D — the same interaction pattern as the Spline “Lamm Genya” configurator, rebuilt in React Three Fiber so it works offline on a mid-range phone.</p>
        </div>

        <div className="mt-8 grid items-start gap-5 lg:grid-cols-[1.05fr_1fr]">
          <div className="reveal sticky top-[72px] z-10 h-[300px] self-start overflow-hidden rounded-2xl border border-charcoal/10 bg-[#f4f2ed] shadow-sm sm:h-[360px] lg:top-24 lg:h-[440px]">
            <Suspense fallback={<div className="grid h-full place-items-center text-graphite">Loading 3D…</div>}>
              <DoorConfigurator frame={frame} glass={glass} openAmount={opening} />
            </Suspense>
          </div>

          <div className="reveal rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-xl font-semibold text-charcoal">{frame.name} · {glass.name}</h3>
              <SampleTag label="Live demo" />
            </div>
            <p className="mt-1 text-sm text-graphite">Powder-coated aluminum, tempered glass. Final shade confirmed from physical shade card before order.</p>

            <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.18em] text-graphite">Aluminum finish</p>
            <div className="mt-2 flex flex-wrap gap-2.5" role="radiogroup" aria-label="Aluminum finish">
              {FINISHES.map((f) => (
                <button
                  key={f.id}
                  role="radio"
                  aria-checked={frame.id === f.id}
                  onClick={() => setFrame(f)}
                  title={f.name}
                  className={`h-10 w-10 rounded-full border-2 transition ${frame.id === f.id ? "scale-110 border-accent" : "border-charcoal/15 hover:scale-105"}`}
                  style={{ background: f.hex }}
                />
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {FINISHES.map((f) => (
                <button key={f.id} onClick={() => setFrame(f)} className={`rounded-full px-3 py-1 text-[12px] font-semibold ${frame.id === f.id ? "bg-charcoal text-white" : "bg-charcoal/5 text-graphite hover:bg-charcoal/10"}`}>
                  {f.name}
                </button>
              ))}
            </div>

            <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.18em] text-graphite">Glass tint</p>
            <div className="mt-2 flex flex-wrap gap-2.5" role="radiogroup" aria-label="Glass tint">
              {GLASS.map((g) => (
                <button
                  key={g.id}
                  role="radio"
                  aria-checked={glass.id === g.id}
                  onClick={() => setGlass(g)}
                  title={g.name}
                  className={`h-10 w-10 rounded-full border-2 transition ${glass.id === g.id ? "scale-110 border-accent" : "border-charcoal/15 hover:scale-105"}`}
                  style={{ background: g.css }}
                />
              ))}
            </div>

            <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.18em] text-graphite">Try the slide — open / close</p>
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={() => setOpening(0)}
                className={`rounded-full px-4 py-2 text-[13px] font-bold transition ${opening === 0 ? "bg-charcoal text-white" : "bg-charcoal/5 text-graphite hover:bg-charcoal/10"}`}
              >
                Shut
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(opening * 100)}
                onChange={(e) => setOpening(Number(e.target.value) / 100)}
                className="door-range w-full"
                aria-label="Door opening amount"
              />
              <button
                onClick={() => setOpening(1)}
                className={`rounded-full px-4 py-2 text-[13px] font-bold transition ${opening === 1 ? "bg-charcoal text-white" : "bg-charcoal/5 text-graphite hover:bg-charcoal/10"}`}
              >
                Open
              </button>
            </div>
            <p className="mt-1.5 text-[12px] text-graphite/70">
              {opening === 0 ? "Fully shut — check the meeting stile line." : opening === 1 ? "Wide open — rollers carry each panel." : `${Math.round(opening * 100)}% open — drag to glide it.`}
            </p>

            <a
              href={waLink(`${frame.name} aluminum with ${glass.name} glass`)}
              target="_blank"
              rel="noreferrer"
              className="mt-5 block rounded-full bg-charcoal px-6 py-3 text-center text-[15px] font-semibold text-white transition hover:bg-graphite"
            >
              Ask price for this combination →
            </a>
            <p className="mt-2 text-center text-[12px] text-graphite/70">Prefilled WhatsApp message included — client just taps send.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
