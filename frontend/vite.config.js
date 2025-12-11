import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: { alias: { '@': '/src' } },
  plugins: [
    react(),
    tailwindcss()
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      reporter: ['json', 'lcov'],
      reportsDirectory: './coverage'
    }
  },
  server: {
    host: true,
    port: 5173
  }
})
