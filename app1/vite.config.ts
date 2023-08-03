import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    watch: { usePolling: true },
    hmr: true,
    port: 9001,
    headers: {
      'Access-Control-Allow-Origin': '*', // 主应用获取子应用时跨域响应头
    },
  },
  plugins: [
    vue(),
    qiankun('vue3', {
      useDevMode: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
