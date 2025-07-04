import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [ svgr(), tailwindcss(),],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['todo.punpunpunnawat.online'],
  }
})
