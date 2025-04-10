import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import babel from "vite-plugin-babel";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  plugins: [
    react(),
    svgr(),
    babel()
    // babel({
    //   babelrc: false,
    //   presets: ['@babel/preset-env'],
    //   plugins: ['@babel/plugin-transform-runtime']
    // })
  ],
  build: {
    chunkSizeWarningLimit: 3000,
    outDir: 'dist', // Default output directory
  },
  resolve: {
    alias: [
      { find: '@assets', replacement: '/src/assets' },
      { find: '@components', replacement: '/src/components' },
      { find: '@pages', replacement: '/src/pages' },
      { find: '@helpers', replacement: '/src/helpers' },
      { find: '@store', replacement: '/src/store' },
      { find: '@type', replacement: '/src/type' },
    ],
  },
  base: '/', 
})
