import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/admin/', // cambiar a /admin/ para produccio
  css: {
    devSourcemap: false
  },
  build: {
    assetsDir: 'admin_static', // 👈 tiene que ir dentro de build
  },
});