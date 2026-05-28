import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false, // Prevents code-sniffing by disabling production source maps
  },
  server: {
    proxy: {
      // Forward all /api/* requests to the NestJS backend (port 3000).
      // Until the backend is live, the fetch returns an error that the
      // DownloadCVButton error state will surface to the user gracefully.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
