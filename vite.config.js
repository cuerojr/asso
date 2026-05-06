import {
  defineConfig
} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // cambiar a /admin/ para produccio
  css: {
    devSourcemap: false
  },
  build: {
    assetsDir: 'admin_static',
    /*rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['redux', 'react-redux', 'redux-saga', 'redux-thunk'],
          'vendor-firebase': ['firebase'],
          'vendor-editor': ['react-quill'],
          'vendor-charts': ['chart.js', 'react-chartjs-2'],
          'vendor-calendar': ['react-big-calendar', 'moment'],
          'vendor-video': ['video.js'],
          'vendor-xlsx': ['xlsx'],
          'vendor-ui': ['reactstrap', 'react-select', 'react-datepicker'],
        }
      }
    }*/
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  }
});