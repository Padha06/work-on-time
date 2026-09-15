import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import TrustStrip from "./components/TrustStrip.jsx";
import Services from "./components/Services.jsx";
import BeforeAfter from "./components/BeforeAfter.jsx";
import FinishExplorer from "./components/FinishExplorer.jsx";
import CaseStudy from "./components/CaseStudy.jsx";
import Process from "./components/Process.jsx";
import Portfolio from "./components/Portfolio.jsx";
import Testimonials from "./components/Testimonials.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    window.gsap = gsap;
    window.ScrollTrigger = ScrollTrigger;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis = null;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (t) => {
        lenis.raf(t);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }

    // Anchor navigation through Lenis (or native fallback)
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const el = document.querySelector(a.getAttribute("href"));
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: -64 });
      else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    };
    document.addEventListener("click", onClick);

    // Staggered reveals
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      // Pinned case study (desktop only, skip on reduced motion)
      if (!reduced && window.innerWidth > 900) {
        gsap.fromTo(
          "#case-pin",
          { scale: 0.985 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: "#case", start: "top 70%", end: "center 45%", scrub: 1 },
          }
        );
      }
      // Hero copy entrance after first door motion
      gsap.fromTo(
        "[data-hero-copy]",
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power3.out" }
      );
    });

    return () => {
      document.removeEventListener("click", onClick);
      ctx.revert();
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-cream font-ui text-charcoal">
      <a href="#services" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Services />
        <BeforeAfter />
        <FinishExplorer />
        <CaseStudy />
        <Process />
        <Portfolio />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
