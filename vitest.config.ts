import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';
// 1. 导入 browser mode 所需的 provider 函数
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './packages'),
      '@monorepo/utils': path.resolve(__dirname, './packages/utils/src'),
      '@monorepo/components': path.resolve(__dirname, './packages/components/src'),
    },
    extensions: ['.ts', '.js', '.vue'],
  },
  test: {
    projects: [
      {
        // 工具库项目，使用 Node 环境
        test: {
          globals: true,
          name: 'utils',
          include: ['packages/utils/**/*.test.{ts,js}'],
          // 明确指定 node 环境
          environment: 'node',
        },
      },
      {
        // 2. 将 vue 插件移动到项目级别，仅作用于 components 项目
        plugins: [vue()],
        test: {
          globals: true,
          name: 'components',
          include: ['packages/components/**/*.test.{ts,js,vue}'],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
    exclude: ['node_modules', 'dist'],
    // 全局的测试超时设置（可选）
    testTimeout: 10000,
  },
});
