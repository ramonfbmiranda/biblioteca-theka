import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // em desenvolvimento, /api vai para a API da EJECT (na Vercel isso é feito pelo vercel.json)
    proxy: {
      "/api": {
        target: "https://thekapitrainee.pythonanywhere.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})