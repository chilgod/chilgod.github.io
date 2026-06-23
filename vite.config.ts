import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'serve-source-entry-at-root',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const request = req as unknown as { url?: string };
          if (request.url === '/') {
            request.url = '/index.source.html';
          } else if (request.url?.indexOf('/?') === 0) {
            request.url = `/index.source.html${request.url.slice(1)}`;
          }
          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: 'index.source.html'
    }
  }
});
