// eslint.config.js (完全扁平化版本)
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import vuePlugin from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

export default [
  // 1. 忽略文件
  { ignores: ['**/dist/**', '**/node_modules/**', '**/*.min.js'] },
  // 2. 全局/通用配置
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.es2025,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
  },
  // 前端目录
  {
    files: ['apps/frontend/**', 'packages/components/**', 'packages/utils/**'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  // 后端目录
  {
    files: ['apps/backend/**'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  // 配置文件单独给 node 环境
  {
    files: ['**/*.config.{js,ts}', 'scripts/**'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  // 3. ESLint 内置推荐规则 (纯JS)
  js.configs.recommended,
  // 4. TypeScript 配置 (统一配置，不再区分src和__test__)
  {
    // 匹配所有 .ts 和 .tsx 文件，包括源码和测试
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        // 统一启用 projectService，让它去自动发现每个文件自己的 tsconfig.json
        projectService: true,
        // 移除 allowDefaultProject，因为现在每个测试文件都有家了
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs?.recommended?.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      // 你可以在这里统一调整规则，这些规则将同时作用于源码和测试
      // 例如，如果你希望在所有地方都禁用某个规则：
      // '@typescript-eslint/some-rule': 'off',
    },
  },
  // 5. Vue 配置 (使用扁平化预设)
  ...vuePlugin.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    // 使用 Vue 插件官方提供的扁平化配置
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // 可覆盖 Vue 规则
      'vue/multi-word-component-names': 'off',
    },
  },
  // 6. React 配置 (使用扁平化预设)
  {
    ...reactPlugin.configs.flat.recommended,
    files: ['**/*.{jsx,tsx}'],
  },
  {
    ...reactHooksPlugin.configs.flat.recommended,
    files: ['**/*.{jsx,tsx}'],
  },
  {
    files: ['**/*.{jsx,tsx}'],
    settings: { react: { version: 'detect' } },
    rules: {
      ...reactPlugin.configs['jsx-runtime'].rules, // 新 JSX 转换规则
      'react/react-in-jsx-scope': 'off', // 关闭旧 JSX 规则
      'react/prop-types': 'off', // 关闭 prop-types（如果用 TS）
    },
  },
  // // 7. Prettier 集成
  // {
  //   plugins: {
  //     prettier: prettierPlugin,
  //   },
  //   rules: {
  //     'prettier/prettier': 'warn',
  //   },
  // },
  // 8. 忽略 TypeScript 类型检查配置
  {
    files: ['vitest.config.ts', 'vite.config.ts', 'playwright.config.ts'],
    ...tseslint.configs.disableTypeChecked,
  },
  // 必须放在最后！让prettier接管prettier
  prettierConfig,
];
