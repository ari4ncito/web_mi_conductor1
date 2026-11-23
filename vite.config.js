import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  envPrefix: ['VITE_', 'BACKEND_URL'],
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'recharts-vendor';
            if (id.includes('xlsx')) return 'xlsx-vendor';
            if (id.includes('react-router')) return 'router-vendor';
            if (id.includes('socket.io-client') || id.includes('engine.io-client')) return 'socket-vendor';
            return 'vendor';
          }
        },
      },
    },
  },
})