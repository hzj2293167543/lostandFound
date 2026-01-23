// eslint.config.js (完全扁平化版本)
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import reactPlugin from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
    // 1. 忽略文件
    { ignores: ['**/dist/**', '**/node_modules/**', '**/*.min.js'] },

    // 2. 全局/通用配置
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
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

    // 3. ESLint 内置推荐规则 (纯JS)
    js.configs.recommended,

    // 4. TypeScript 配置 (手动合并，避免非扁平结构)
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                projectService: true,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            // 可在此添加或覆盖TS规则
        },
    },

    // 5. Vue 配置 (使用扁平化预设)
    {
        files: ['**/*.vue'],
        // 使用 Vue 插件官方提供的扁平化配置
        ...vuePlugin.configs['flat/recommended'],
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
        files: ['**/*.{jsx,tsx}'],
        // 使用 React 插件官方提供的扁平化配置
        ...reactPlugin.configs.flat.recommended,
        settings: {
            react: {
                version: 'detect',
            },
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
        },
    },

    // 7. Prettier 集成
    {
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': 'warn',
        },
    },
    // 必须放在最后！
    prettierConfig,
];
