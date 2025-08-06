// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173, // or any port (Render auto-detects if you use process.env.PORT)
  },
  preview: {
    host: '0.0.0.0',
    port: 8080 // standard Render port (optional)
  }
})
