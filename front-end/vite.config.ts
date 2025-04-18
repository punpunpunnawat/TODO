import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [ svgr(), tailwindcss(),],
})
