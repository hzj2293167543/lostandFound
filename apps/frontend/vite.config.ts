import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    mockDevServerPlugin({
      dir: 'src/mock',
      log: 'info',
      prefix: '^/mock',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173, // 你可以自定义端口
    open: true, // 自动打开浏览器
    proxy: {
      '^/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
