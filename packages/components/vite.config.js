// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 自定义转换函数，在生成 AST 时移除特定属性
          nodeTransforms: [
            (node) => {
              if (node.type === 1) {
                // NodeTypes.ELEMENT
                // 过滤所有 data-testid 属性
                node.props = node.props.filter((prop) => {
                  if (prop.type === 6) {
                    // NodeTypes.ATTRIBUTE
                    return prop.name !== 'data-testid';
                  }
                  return true;
                });
              }
            },
          ],
        },
      },
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Components',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在UMD构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
    outDir: 'dist',
    sourcemap: true,
  },
});
