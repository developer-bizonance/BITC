import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from 'url'

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_'])
  const apiUrl = env.NEXT_PUBLIC_API_URL || env.VITE_API_URL || ''
  const siteUrl = env.NEXT_PUBLIC_SITE_URL || env.VITE_SITE_URL || 'https://bitc.bizonance.com'

  return {
    base: '/', 
    plugins: [react()],
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: {
      'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(apiUrl),
      'process.env.VITE_API_URL': JSON.stringify(apiUrl),
      'process.env.NEXT_PUBLIC_SITE_URL': JSON.stringify(siteUrl),
      'process.env.VITE_SITE_URL': JSON.stringify(siteUrl),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    resolve: {
      alias: {
        // This allows you to use "@" to refer to your "src" folder
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5173,
      host: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('@react-pdf')) {
                return 'vendor-pdf';
              }
              if (id.includes('xlsx')) {
                return 'vendor-xlsx';
              }
              if (id.includes('framer-motion') || id.includes('@dnd-kit')) {
                return 'vendor-animations';
              }
              if (id.includes('lucide-react') || id.includes('pixora-icons') || id.includes('@radix-ui')) {
                return 'vendor-ui-icons';
              }
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'vendor-react';
              }
            }
          },
        },
      },
      chunkSizeWarningLimit: 800,
    },
  }
})
