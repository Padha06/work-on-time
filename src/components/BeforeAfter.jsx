import { useEffect, useRef, useState } from "react";
import { BEFORE_AFTER } from "../data/content.js";

/** Draggable before/after divider — touch + mouse + keyboard. Spec 5.4. */
function Compare({ item }) {
  const [pos, setPos] = useState(50);
  const [loaded, setLoaded] = useState(0);
  const box = useRef(null);
  const dragging = useRef(false);
  const ready = loaded >= 2;

  const setFromClientX = (clientX) => {
    const r = box.current?.getBoundingClientRect();
    if (!r || r.width === 0) return;
    // Full travel: 0–100 so the divider reaches both edges.
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  // Real photo pair when supplied (item.beforeImg), otherwise the same photo
  // with a "damaged" CSS filter as a stand-in for the before side.
  const beforeSrc = item.beforeImg || item.img;
  const beforeStyle = item.beforeImg ? undefined : { filter: item.beforeFilter };

  const onLoad = () => setLoaded((n) => n + 1);

  return (
    <div
      ref={box}
      className="relative h-[420px] select-none overflow-hidden rounded-2xl bg-charcoal sm:h-[520px] lg:h-[560px]"
      style={{ touchAction: "pan-y" }}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) setFromClientX(e.clientX);
      }}
      onPointerUp={() => { dragging.current = false; }}
      onPointerCancel={() => { dragging.current = false; }}
    >
      {/* Loading shimmer — covers both images until BOTH are decoded,
          so before/after always appear together, never one-first. */}
      {!ready && (
        <div className="absolute inset-0 animate-pulse bg-white/5" aria-hidden="true">
          <div className="grid h-full place-items-center text-sm font-semibold text-cream/40">
            Loading photos…
          </div>
        </div>
      )}
      {/* AFTER (full) — contain (not cover) so the whole subject stays
          visible on wide desktop frames instead of a center-crop slice. */}
      <img
        src={item.img}
        alt={`${item.title} — after`}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        draggable={false}
        onLoad={onLoad}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
      />
      {/* BEFORE (clipped left side) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img
          src={beforeSrc}
          alt={`${item.title} — before`}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          draggable={false}
          onLoad={onLoad}
          className={`h-full w-full object-contain transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
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

  // Preload every before/after pair up front (small local files) so
  // switching items is instant and both sides are always cached together.
  useEffect(() => {
    BEFORE_AFTER.forEach((b) => {
      [b.img, b.beforeImg].forEach((src) => {
        if (!src) return;
        const im = new Image();
        im.src = src;
      });
    });
  }, []);
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
