import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/graphql': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        secure: false,
      },
      '/attachments': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})
