import { defineConfig } from 'vite'

const base = process.env.GITHUB_PAGES === 'true' ? '/taskflow-starter/' : '/';

export default defineConfig({
  base: base,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: 'node',
  },
})
