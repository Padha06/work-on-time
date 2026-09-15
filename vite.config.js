import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          spline: ["@splinetool/react-spline", "@splinetool/runtime"],
          motion: ["gsap", "lenis"],
        },
      },
    },
  },
})
