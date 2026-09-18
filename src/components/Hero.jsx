import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNetworkStatus } from "react-adaptive-hooks/network";
import { useSaveData } from "react-adaptive-hooks/save-data";
import SampleTag from "./SampleTag.jsx";
import { waLink } from "../data/content.js";

gsap.registerPlugin(ScrollTrigger);

const Spline = lazy(() => import("@splinetool/react-spline"));
const SlidingDoorScene = lazy(() => import("./SlidingDoorScene.jsx"));
const SPLINE_URL = import.meta.env.VITE_SPLINE_SCENE_URL || "";

/**
 * Hero — Section 1.
 * The door is owned ENTIRELY by scroll: the hero pins for +130% viewport
 * travel and scroll progress maps straight to door 0 (closed) → 1 (open).
 * A single writer means the button/drag-vs-scroll fight from the old
 * version can't happen. Reduced-motion users get a static image, no pin.
 */
export default function Hero({ splineReady, onSplineReady }) {
  const sectionRef = useRef(null);
  const progressRef = useRef(0); // starts fully closed
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
  );
  const [splineFailed, setSplineFailed] = useState(false);
  // Adaptive loading: slow connections / data-saver get a static hero
  // image instead of the ~1MB 3D scene + remote HDR environment.
  const { effectiveConnectionType } = useNetworkStatus("4g");
  const { saveData } = useSaveData();
  const slowConnection =
    saveData === true || ["slow-2g", "2g", "3g"].includes(effectiveConnectionType);
  const useSpline = Boolean(SPLINE_URL) && !splineFailed && !slowConnection;
  // Pin runs on desktop only: on phones the hero is a static section
  // (no scroll-trap, no heavy scrub timeline).
  const pinEnabled = !reduced && !useSpline && !slowConnection && !compact;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", onChange);
    document.documentElement.classList.toggle("reduced-motion", mq.matches);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const onCompact = (e) => setCompact(e.matches);
    mq.addEventListener?.("change", onCompact);
    return () => mq.removeEventListener?.("change", onCompact);
  }, []);

  // Pin effect uses useLayoutEffect (not useEffect) on purpose: ScrollTrigger's
  // pin physically moves this section into a pin-spacer div. Layout-effect
  // cleanup runs BEFORE React detaches unmounted DOM, so ctx.revert() un-pins
  // and restores the section first. With useEffect the cleanup runs too late
  // and React crashes with "removeChild ... not a child of this node".
  useLayoutEffect(() => {
    if (!pinEnabled) return;
    const pinEnd = compact ? "+=100%" : "+=130%";
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: pinEnd,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress; // 0 shut → 1 wide open
        },
      });
      // Copy drifts up and fades while the door takes over.
      gsap.fromTo(
        "[data-hero-copy]",
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: -70,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: compact ? "+=70%" : "+=90%", scrub: true },
        }
      );
    });
    return () => ctx.revert();
  }, [pinEnabled, compact]);

  return (
    <section ref={sectionRef} id="top" className="hero-grain relative flex min-h-[100svh] items-stretch overflow-hidden bg-charcoal text-cream">
      <div className="absolute inset-0" aria-hidden="true">
        {useSpline ? (
          <Suspense fallback={<div className="grid h-full place-items-center text-cream/60">Loading 3D…</div>}>
            <Spline
              scene={SPLINE_URL}
              onLoad={() => onSplineReady?.(true)}
              onError={() => setSplineFailed(true)}
            />
          </Suspense>
        ) : reduced || slowConnection ? (
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop"
            alt="Sliding aluminum door, static hero image for reduced motion or slow connections"
            className="h-full w-full object-cover opacity-70"
          />
        ) : (
          <Suspense fallback={<div className="grid h-full place-items-center text-cream/60">Loading 3D…</div>}>
            <SlidingDoorScene progressRef={progressRef} frameColor="#C9CDD2" glassOpacity={0.3} glassColor="#cfe3e8" compact={compact} idleMotion={compact} />
          </Suspense>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/35 to-charcoal/60" />

      <div className="relative mx-auto flex w-full max-w-content flex-col justify-end px-4 pb-14 pt-28 sm:px-6 md:justify-center md:pb-24">
        <div className="max-w-2xl" data-hero-copy>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-aluminum">
            Furniture · Repair · Aluminum doors
          </p>
          <h1 className="font-display font-semibold leading-[1.02] tracking-tight text-[clamp(2.25rem,8vw,4.5rem)]">
            Built like furniture.
            <br />
            <span className="text-aluminum">Sealed like engineering.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-cream/75 sm:text-lg">
            Custom woodwork, honest repairs, and sliding aluminum doors that glide with one
            finger — measured, built and installed by one team.
          </p>
          <div className="pointer-events-auto mt-6 flex flex-wrap items-center gap-3">
            <Link to="/contact" className="rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white shadow-lg transition hover:brightness-110">
              Get a free quote
            </Link>
            <a
              href={waLink("sliding aluminum doors")}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-[15px] font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              WhatsApp photos →
            </a>
          </div>
          {pinEnabled && (
            <p className="mt-6 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em] text-cream/60">
              <span className="inline-block animate-[drift_2.2s_ease-in-out_infinite]">↓</span> Scroll — the door opens as you go
            </p>
          )}
          {!SPLINE_URL && import.meta.env.DEV && (
            <p className="pointer-events-auto mt-4 max-w-xl text-[12px] leading-relaxed text-cream/50">
              <SampleTag label="3D placeholder — Spline remix slot" /> Set{" "}
              <code className="rounded bg-white/10 px-1">VITE_SPLINE_SCENE_URL</code> to your remixed
              door scene from community.spline.design/tag/door to swap this R3F interaction for the
              live Spline scene. No code change needed.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
