import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://ip24ssi4.sit.kmutt.ac.th:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/itb-mshop/v1'),
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      },
    },
  },
});
