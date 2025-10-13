import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  define: {
    'process.env': {},
    'global': 'globalThis',
  },
  optimizeDeps: {
    include: ['process/browser', 'buffer', 'util', 'js-tiktoken'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
})
