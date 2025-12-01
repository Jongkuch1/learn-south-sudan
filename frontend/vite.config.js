// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    allowedHosts: ['learn-south-sudan-4.onrender.com'], 
    host: '0.0.0.0',
    strictPort: true,
    port: 5173
  }
})
