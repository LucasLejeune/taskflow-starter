import { defineConfig } from 'vite'

export default defineConfig({
  base: '/taskflow-starter/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: 'node',
  },
})
