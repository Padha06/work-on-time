import { useRef, useState } from "react";
import { BEFORE_AFTER } from "../data/content.js";

/** Draggable before/after divider — touch + mouse + keyboard. Spec 5.4. */
function Compare({ item }) {
  const [pos, setPos] = useState(50);
  const box = useRef(null);

  const setFromClientX = (clientX) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  };

  // Real photo pair when supplied (item.beforeImg), otherwise the same photo
  // with a "damaged" CSS filter as a stand-in for the before side.
  const beforeSrc = item.beforeImg || item.img;
  const beforeStyle = item.beforeImg ? undefined : { filter: item.beforeFilter };

  return (
    <div
      ref={box}
      className="relative h-[320px] select-none overflow-hidden rounded-2xl bg-charcoal sm:h-[440px]"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture?.(e.pointerId);
        setFromClientX(e.clientX);
        const move = (ev) => setFromClientX(ev.clientX);
        const up = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
      }}
      onTouchMove={(e) => setFromClientX(e.touches[0].clientX)}
    >
      {/* AFTER (full) */}
      <img src={item.img} alt={`${item.title} — after`} loading="lazy" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
      {/* BEFORE (clipped left side) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img
          src={beforeSrc}
          alt={`${item.title} — before`}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover"
          style={beforeStyle}
        />
        {!item.beforeImg && <div className="absolute inset-0 bg-charcoal/20" />}
      </div>
      <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">Before</span>
      <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">After</span>
      {/* divider */}
      <div className="absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -left-px w-0.5 bg-white shadow" />
        <div className="absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white font-bold text-charcoal shadow-xl">↔</div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`${item.title}: reveal before and after`}
        className="absolute bottom-3 left-1/2 w-56 -translate-x-1/2 opacity-0 focus:opacity-100"
      />
    </div>
  );
}

export default function BeforeAfter() {
  const [i, setI] = useState(0);
  const item = BEFORE_AFTER[i];
  return (
    <section id="before-after" className="section-pad bg-charcoal text-cream">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Repair proof</p>
            <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Drag the line. See the comeback.</h2>
            <p className="mt-3 text-cream/70">Real repair transformations. Left is tired &amp; damaged, right is handed back.</p>
          </div>
        </div>
        <div className="reveal mt-8">
          <Compare key={item.id} item={item} />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[15px] font-medium text-cream/90">{item.title}</p>
            <div className="flex gap-2">
              <button onClick={() => setI((i - 1 + BEFORE_AFTER.length) % BEFORE_AFTER.length)} className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10" aria-label="Previous repair">← Prev</button>
              <span className="px-2 py-2 text-sm text-cream/60">{i + 1} / {BEFORE_AFTER.length}</span>
              <button onClick={() => setI((i + 1) % BEFORE_AFTER.length)} className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10" aria-label="Next repair">Next →</button>
            </div>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {BEFORE_AFTER.map((b, bi) => (
              <button
                key={b.id}
                onClick={() => setI(bi)}
                className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${bi === i ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"}`}
                aria-label={`Show ${b.title}`}
              >
                <img src={b.img} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
