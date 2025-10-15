import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // ← для Docker
    port: 5174,       // ← совпадает с портом в docker-compose
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://backend:3000',  // ← для Docker
        changeOrigin: true
      }
    }
  }
})