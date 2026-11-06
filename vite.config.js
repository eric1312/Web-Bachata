import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // funciona en cualquier hosting / subcarpeta
  // En desarrollo, las llamadas /api van al servidor de Node (npm run server)
  server: { proxy: { '/api': 'http://localhost:3001' } },
})
