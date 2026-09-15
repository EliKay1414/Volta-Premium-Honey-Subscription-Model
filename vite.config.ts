import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
    alias: [
      {
        find: /^~/,
        replacement: '',
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
    ],
  },
  define: {
    'process.env': {
      PUBLIC_URL: '',
      REACT_APP_BASE_LAYOUT_CONFIG_KEY: 'LayoutConfig',
      REACT_APP_API_URL: '',
    },
  },
  server: {
    port: 3011,
    open: false,
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 3500,
  },
})
