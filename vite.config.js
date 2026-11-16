import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    rollupOptions: {
      // Two pages: the website and the admin panel (admin.html)
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html')
      }
    }
  }
});
