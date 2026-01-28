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
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'three-fiber': ['@react-three/fiber'],
          'three-drei': ['@react-three/drei'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'react-hot-toast', 'framer-motion']
        }
      }
    },
    target: 'es2015',
    cssCodeSplit: true,
    assetsInlineLimit: 4096
  },

  publicDir: 'public',
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'three', '@react-three/fiber', '@react-three/drei'],
    esbuildOptions: {
      sourcemap: false
    }
  }
})

