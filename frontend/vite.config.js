import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,

    // Aggressive code splitting for faster mobile loading
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate Three.js and React Three Fiber into their own chunks
          'three-core': ['three'],
          'three-fiber': ['@react-three/fiber'],
          'three-drei': ['@react-three/drei'],

          // Separate React and React Router
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Separate UI libraries
          'ui-vendor': ['lucide-react', 'react-hot-toast', 'framer-motion']
        }
      }
    },

    // Target modern browsers for smaller bundle size
    target: 'es2015',

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Optimize chunk size
    assetsInlineLimit: 4096 // Inline assets smaller than 4kb
  },

  publicDir: 'public',

  // Optimize dependencies - FIX source map warnings
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'three', '@react-three/fiber', '@react-three/drei'],
    esbuildOptions: {
      // Disable source maps in dependencies to avoid warnings
      sourcemap: false
    }
  }
})

