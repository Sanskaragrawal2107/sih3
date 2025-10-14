import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: [
        '@xenova/transformers',
        'llamaindex',
        'chromadb',
        'mongodb',
        'google-auth-library',
        'weaviate-client'
      ]
    }
  },
  optimizeDeps: {
    include: ['process/browser', 'buffer', 'util', 'js-tiktoken'],
    exclude: ['llamaindex', 'chromadb', '@xenova/transformers'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
})
