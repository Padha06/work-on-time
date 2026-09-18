import Portfolio from "../components/Portfolio.jsx";
import CaseStudy from "../components/CaseStudy.jsx";
import Testimonials from "../components/Testimonials.jsx";

export default function WorkPage() {
  return (
    <div className="pt-16">
      <section className="bg-charcoal py-20 text-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal max-w-2xl">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Our Work</p>
            <h1 className="font-display mt-2 text-5xl font-semibold tracking-tight md:text-6xl">
              A wall of finished jobs.
            </h1>
            <p className="mt-4 text-cream/70">
              Every project ends with a photo walkthrough. Here's what we've built, repaired and installed.
            </p>
          </div>
        </div>
      </section>
      <CaseStudy />
      <Portfolio />
      <Testimonials />
    </div>
  );
}
