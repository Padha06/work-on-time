import SampleTag from "./SampleTag.jsx";
import { CASE_STUDY } from "../data/content.js";

export default function CaseStudy() {
  return (
    <section id="case" className="bg-cream pb-4">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div id="case-pin" className="reveal overflow-hidden rounded-3xl bg-charcoal text-cream">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-[280px]">
              <img src={CASE_STUDY.img} alt={CASE_STUDY.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute left-4 top-4"><SampleTag /></div>
            </div>
            <div className="p-7 sm:p-10">
              <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">{CASE_STUDY.kicker} [TODO: real project photos]</p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{CASE_STUDY.title}</h2>
              {CASE_STUDY.body.map((p) => (
                <p key={p.slice(0, 24)} className="mt-3 leading-relaxed text-cream/75">{p}</p>
              ))}
              <div className="mt-5 flex flex-wrap gap-2">
                {CASE_STUDY.meta.map((m) => (
                  <span key={m} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[13px] font-medium">{m}</span>
                ))}
              </div>
              <a href="#contact" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white hover:brightness-110">
                I want something like this
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
