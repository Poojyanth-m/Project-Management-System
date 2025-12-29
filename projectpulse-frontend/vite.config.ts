import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            // Spoof the Origin header to match backend expectations
            proxyReq.setHeader('Origin', 'http://localhost:3000');
          });
          proxy.on('proxyRes', (proxyRes, _req, _res) => {
            // Strip CORS headers from response so browser doesn't complain about port mismatch
            delete proxyRes.headers['access-control-allow-origin'];
            delete proxyRes.headers['access-control-allow-methods'];
            delete proxyRes.headers['access-control-allow-headers'];
          });
        },
      },
    },
  },
})
