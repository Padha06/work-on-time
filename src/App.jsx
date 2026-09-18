import { useEffect, Component, Suspense, lazy } from "react";
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

// Admin pages — lazy so charts/admin code never loads (or preloads) for
// public visitors. Keeps the mobile first paint light.
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.jsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.jsx"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview.jsx"));
const AdminRequests = lazy(() => import("./pages/admin/AdminRequests.jsx"));
const AdminClaims = lazy(() => import("./pages/admin/AdminClaims.jsx"));
const AdminCallbacks = lazy(() => import("./pages/admin/AdminCallbacks.jsx"));
const AdminPortfolio = lazy(() => import("./pages/admin/AdminPortfolio.jsx"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics.jsx"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings.jsx"));
import AdminRoute from "./components/admin/AdminRoute.jsx";

function AdminSplash() {
  return (
    <div className="min-h-screen bg-charcoal grid place-items-center">
      <div className="text-cream/60 animate-pulse">Loading admin…</div>
    </div>
  );
}

// Shared layout
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

gsap.registerPlugin(ScrollTrigger);

/**
 * Route-level error boundary — a crashing page must NEVER blank the whole
 * app (navbar included). Shows the actual error + a reload action instead,
 * and auto-resets on the next navigation.
 */
class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("Route render error:", error, info);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-[60vh] bg-cream px-4 pt-16">
          <div className="mx-auto max-w-md py-20 text-center">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Something went wrong</p>
            <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-charcoal">
              This page failed to load.
            </h2>
            <p className="mt-3 break-words text-sm leading-relaxed text-graphite">
              {String(this.state.error?.message || this.state.error)}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-charcoal px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-graphite"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Shared layout wrapper — provides Lenis smooth scroll + GSAP reveals */
function Layout() {
  const location = useLocation();

  useEffect(() => {
    // Always start new routes at the top (both native + Lenis scroll).
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.toggle("reduced-motion", reduced);

    // Reduced motion: never hide content, clear any stale hidden state.
    if (reduced) {
      gsap.set(".reveal", { opacity: 1, y: 0, clearProps: "transform" });
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ScrollTrigger.refresh();
      return;
    }

    // Canonical Lenis + ScrollTrigger wiring (ticker-driven, no runaway raf).
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tickerFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);
    lenis.scrollTo(0, { immediate: true });

    // Smooth anchor scroll
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -64 });
    };
    document.addEventListener("click", onClick);

    // Reveal animations — fail-open: elements stay visible unless GSAP
    // explicitly hides them right before attaching a trigger. Above-fold
    // elements animate immediately; a safety pass rescues any in-view
    // element still hidden (stale trigger positions, late images, etc.).
    let ctx;
    const setupTimer = setTimeout(() => {
      ctx = gsap.context(() => {
        ScrollTrigger.refresh();
        gsap.utils.toArray(".reveal").forEach((el) => {
          if (el.dataset.revealed) return;
          const r = el.getBoundingClientRect();
          const inView = r.top < window.innerHeight * 0.9 && r.bottom > 0;
          if (inView) {
            el.dataset.revealed = "true";
            gsap.fromTo(
              el,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", overwrite: true, clearProps: "transform" }
            );
          } else {
            gsap.set(el, { opacity: 0, y: 30 });
            gsap.to(el, {
              opacity: 1, y: 0, duration: 0.8, ease: "power3.out", overwrite: true, clearProps: "transform",
              scrollTrigger: {
                trigger: el, start: "top 88%", once: true,
                onEnter: () => { el.dataset.revealed = "true"; },
                onEnterBack: () => { el.dataset.revealed = "true"; },
              },
            });
          }
        });
      });
    }, 60);

    // Late layout shifts (images, lazy 3D) move trigger positions.
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 600);

    // Safety net: never leave in-view content invisible.
    const safetyTimer = setTimeout(() => {
      document.querySelectorAll(".reveal").forEach((el) => {
        const r = el.getBoundingClientRect();
        const inView = r.top < window.innerHeight && r.bottom > 0;
        if (!inView) return;
        const opacity = parseFloat(window.getComputedStyle(el).opacity);
        if (opacity < 0.05) {
          el.dataset.revealed = "true";
          gsap.to(el, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", overwrite: true, clearProps: "transform" });
        }
      });
      ScrollTrigger.refresh();
    }, 2000);

    return () => {
      clearTimeout(setupTimer);
      clearTimeout(refreshTimer);
      clearTimeout(safetyTimer);
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tickerFn);
      if (ctx) ctx.revert();
      if (lenis) lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-cream font-ui text-charcoal">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <RouteErrorBoundary resetKey={location.pathname}>
          <Outlet />
        </RouteErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes — separate layout, no public navbar */}
        <Route path="/admin/login" element={<Suspense fallback={<AdminSplash />}><AdminLogin /></Suspense>} />
        <Route path="/admin" element={<AdminRoute><Suspense fallback={<AdminSplash />}><AdminLayout /></Suspense></AdminRoute>}>
          <Route index element={<AdminOverview />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="claims" element={<AdminClaims />} />
          <Route path="callbacks" element={<AdminCallbacks />} />
          <Route path="portfolio" element={<AdminPortfolio />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Public routes — shared layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/marketplace/request/:id" element={<RequestDetailPage />} />
          <Route path="/post-request" element={<PostRequestPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
