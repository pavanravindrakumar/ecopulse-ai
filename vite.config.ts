import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'animation';
            if (id.includes('recharts')) return 'charts';
            if (id.includes('zustand')) return 'state';
            if (id.includes('react-router-dom') || id.includes('react-dom') || id.includes('/react/')) {
              return 'react-vendor';
            }
          }
        },
      },
    },
  },
})
