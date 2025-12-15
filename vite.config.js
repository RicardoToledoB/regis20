import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: './', // 👈 importante para servir correctamente los assets en Railway
  build: {
    outDir: 'dist', // por defecto, pero explícito
  },
  server: {
    port: 8080,
    host: '0.0.0.0', // 👈 opcional si quieres levantarlo igual que Railway
  },
})
