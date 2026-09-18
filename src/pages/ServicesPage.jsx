import { Suspense, lazy } from "react";
import Services from "../components/Services.jsx";
import BeforeAfter from "../components/BeforeAfter.jsx";
import FinishExplorer from "../components/FinishExplorer.jsx";
import { Link } from "react-router-dom";
import { waLink, FINISHES, GLASS, SERVICES } from "../data/content.js";

const DoorStage = lazy(() => import("../components/DoorStage.jsx"));

const JUMPS = [
  { label: "Custom build", href: "#services" },
  { label: "Repair", href: "#repair" },
  { label: "Aluminum", href: "#finishes" },
  { label: "Sliding doors", href: "#sliding-doors" },
];

const PROMISES = [
  { title: "Free site measurement", text: "Wardrobes, kitchens and full-home jobs start with a visit and a tape — never a guess." },
  { title: "Fixed quote before we start", text: "One number covering materials, build and install. It doesn't move unless the scope does." },
  { title: "Photo walkthrough on handover", text: "Every job ends with documented proof: glide-tests, polish checks and finished photos." },
];

export default function ServicesPage() {
  return (
    <div className="pt-16">
      {/* Page header — split hero with quick-jump index */}
      <section className="bg-charcoal py-20 text-cream">
        <div className="mx-auto grid max-w-content items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="reveal max-w-2xl">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Our Services</p>
            <h1 className="font-display mt-2 text-5xl font-semibold tracking-tight md:text-6xl">
              Four services.<br />
              <span className="text-aluminum">One phone number.</span>
            </h1>
            <p className="mt-4 text-cream/70 max-w-xl">
              Custom woodwork, honest repairs, aluminum doors and sliding systems — measured, built and installed by one team.
            </p>
            <div className="mt-6 flex flex-wrap gap-2" aria-label="Jump to a service">
              {JUMPS.map((j) => (
                <a
                  key={j.href}
                  href={j.href}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[13px] font-semibold text-cream transition hover:bg-white/15"
                >
                  {j.label} ↓
                </a>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/post-request" className="rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white transition hover:brightness-110">
                Post a Request
              </Link>
              <a
                href={waLink("your services")}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/25 px-6 py-3 text-[15px] font-semibold transition hover:bg-white/10"
              >
                WhatsApp us
              </a>
            </div>
          </div>
          <div className="reveal relative hidden lg:block">
            <div className="overflow-hidden rounded-3xl border border-white/10 shadow-xl">
              <img src={SERVICES[0].img} alt="Custom-built living room furniture" className="h-72 w-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -left-8 w-56 overflow-hidden rounded-2xl border border-white/10 shadow-xl">
              <img src={SERVICES[2].img} alt="Installed aluminum door" className="h-40 w-full object-cover" />
            </div>
            <div className="absolute -top-5 -right-3 rounded-2xl bg-accent px-5 py-3 shadow-xl">
              <p className="font-display text-2xl font-semibold leading-none text-white">850+</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-white/80">Projects done</p>
            </div>
          </div>
        </div>
      </section>

      {/* Promise strip — what every service includes */}
      <section className="border-b border-charcoal/10 bg-cream">
        <div className="mx-auto grid max-w-content gap-5 px-4 py-10 sm:px-6 md:grid-cols-3">
          {PROMISES.map((p) => (
            <div key={p.title} className="reveal flex gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/12 font-bold text-accent">✓</span>
              <div>
                <h2 className="font-bold text-charcoal">{p.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-graphite">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All four services */}
      <Services />

      {/* Repair section with before/after */}
      <section id="repair" className="section-pad bg-white">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal max-w-2xl mb-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Furniture Repair &amp; Restoration</p>
            <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight text-charcoal md:text-5xl">
              Drag the line. See the comeback.
            </h2>
            <p className="mt-3 text-graphite">Real repair transformations. Left is tired &amp; damaged, right is handed back.</p>
          </div>
        </div>
        <BeforeAfter />
        <div className="mx-auto max-w-content px-4 sm:px-6 mt-8">
          <a
            href={waLink("furniture repair")}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white transition hover:brightness-110"
          >
            Request Repair Service →
          </a>
        </div>
      </section>

      {/* Finish explorer — Aluminum Doors */}
      <section id="finishes" className="section-pad bg-charcoal text-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal max-w-2xl mb-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Aluminum Doors</p>
            <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
              Pick your finish.
            </h2>
            <p className="mt-3 text-cream/70">Powder-coated frames, tempered or frosted glass — see the options before you commit.</p>
          </div>
        </div>
        <FinishExplorer />
        <div className="mx-auto max-w-content px-4 sm:px-6 mt-8">
          <a
            href={waLink("aluminum doors")}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white transition hover:brightness-110"
          >
            Request Aluminum Door Quote →
          </a>
        </div>
      </section>

      {/* 3D Door Configurator — Sliding Doors */}
      <section id="sliding-doors" className="section-pad bg-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal max-w-2xl mb-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Sliding Aluminum Doors</p>
            <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight text-charcoal md:text-5xl">
              The door that opens as you scroll.
            </h2>
            <p className="mt-3 text-graphite">Space-saving sliders for balconies, partitions &amp; wardrobes — glide-tested before handover.</p>
          </div>
          <div className="reveal rounded-3xl overflow-hidden border border-charcoal/10 shadow-xl h-[480px] bg-charcoal">
            <Suspense fallback={<div className="grid h-full place-items-center text-cream/60">Loading 3D…</div>}>
              <DoorStage frame={FINISHES[0]} glass={GLASS[0]} openAmount={0.45} />
            </Suspense>
          </div>
          <div className="mt-8">
            <a
              href={waLink("sliding aluminum doors")}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white transition hover:brightness-110"
            >
              Request Sliding Door Quote →
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-charcoal text-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6 text-center">
          <div className="reveal max-w-xl mx-auto">
            <h2 className="font-display text-3xl font-semibold tracking-tight">Ready to start your project?</h2>
            <p className="mt-3 text-cream/70">Post a request on our marketplace or get a direct quote from Work On Time.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/post-request" className="rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white transition hover:brightness-110">
                Post a Request
              </Link>
              <Link to="/contact" className="rounded-full border border-white/25 px-6 py-3 text-[15px] font-semibold transition hover:bg-white/10">
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
