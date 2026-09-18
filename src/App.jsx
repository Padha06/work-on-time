import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Pages
import HomePage from "./pages/HomePage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import MarketplacePage from "./pages/MarketplacePage.jsx";
import RequestDetailPage from "./pages/RequestDetailPage.jsx";
import PostRequestPage from "./pages/PostRequestPage.jsx";
import HowItWorksPage from "./pages/HowItWorksPage.jsx";
import WorkPage from "./pages/WorkPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminOverview from "./pages/admin/AdminOverview.jsx";
import AdminRequests from "./pages/admin/AdminRequests.jsx";
import AdminClaims from "./pages/admin/AdminClaims.jsx";
import AdminPortfolio from "./pages/admin/AdminPortfolio.jsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import AdminRoute from "./components/admin/AdminRoute.jsx";

// Shared layout
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

gsap.registerPlugin(ScrollTrigger);

/** Shared layout wrapper — provides Lenis smooth scroll + GSAP reveals */
function Layout() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis = null;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }

    // Smooth anchor scroll (hash links)
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

    // Staggered reveal animations (re-run on route change)
    const ctx = gsap.context(() => {
      // Small timeout to let the DOM paint the new route
      setTimeout(() => {
        ScrollTrigger.refresh();
        gsap.utils.toArray(".reveal").forEach((el) => {
          gsap.set(el, { opacity: 0, y: 30 });
          gsap.to(el, {
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
      }, 100);
    });

    return () => {
      document.removeEventListener("click", onClick);
      ctx.revert();
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-cream font-ui text-charcoal">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content"><Outlet /></main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes — separate layout, no public navbar */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminOverview />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="claims" element={<AdminClaims />} />
          <Route path="portfolio" element={<AdminPortfolio />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Public routes — shared layout */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
        <Route path="/marketplace" element={<Layout><MarketplacePage /></Layout>} />
        <Route path="/marketplace/request/:id" element={<Layout><RequestDetailPage /></Layout>} />
        <Route path="/post-request" element={<Layout><PostRequestPage /></Layout>} />
        <Route path="/how-it-works" element={<Layout><HowItWorksPage /></Layout>} />
        <Route path="/work" element={<Layout><WorkPage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
