import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    // Don't preload chunks no public first paint needs: spline (disabled
    // feature) and supabase (loads on demand at marketplace/work/admin).
    // three/motion/router stay preloaded (hero + shell).
    modulePreload: {
      polyfill: true,
      resolveDependencies: (filename, deps) =>
        deps.filter((d) => !/spline|supabase/.test(d)),
    },
    rollupOptions: {
      output: {
        manualChunks: {
          three:    ["three", "@react-three/fiber", "@react-three/drei"],
          spline:   ["@splinetool/react-spline", "@splinetool/runtime"],
          motion:   ["gsap", "lenis"],
          router:   ["react-router-dom"],
          supabase: ["@supabase/supabase-js"],
          charts:   ["recharts", "react-is"],
        },
      },
    },
  },
})

