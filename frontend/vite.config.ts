import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    open: true
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
      '@components': resolve('./src/components'),
      '@components/icons': resolve('./src/components/icons'),
      '@components/ui': resolve('./src/components/ui'),
      '@pages': resolve('./src/pages'),
      '@hooks': resolve('./src/hooks'),
      '@utils': resolve('./src/utils'),
      '@services': resolve('./src/services'),
      '@types': resolve('./src/types'),
      '@assets': resolve('./src/assets'),
      '@mock': resolve('./src/mock')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          utils: ['axios', '@tanstack/react-query']
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      css: {
        additionalData: '@import "@/styles/variables.css";'
      }
    }
  }
});