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
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'react-query',
      'lucide-react',
      'apexcharts',
      'react-apexcharts',
      'formik',
      'yup',
      'axios',
      'clsx',
      'react-bootstrap',
      '@popperjs/core',
      'react-inlinesvg',
      'react-topbar-progress-indicator',
    ],
  },
  server: {
    port: 3011,
    open: false,
    host: true,
    warmup: {
      clientFiles: [
        './src/index.tsx',
        './src/App.tsx',
        './src/assets/sass/style.scss',
        './src/assets/sass/plugins.scss',
        './src/assets/sass/style.react.scss',
        './src/pages/dashboard/DashboardWrapper.tsx',
      ],
    },
  },
  build: {
    chunkSizeWarningLimit: 3500,
  },
})
