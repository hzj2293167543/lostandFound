// prettier.config.js (ES Module 版本)
// @ts-check

/**
 * @type {import('prettier').Options}
 */
const config = {
  // ======================
  // 基础格式设置
  // ======================
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  proseWrap: 'preserve',

  // ======================
  // HTML/XML/Vue 相关设置
  // ======================
  htmlWhitespaceSensitivity: 'css',
  vueIndentScriptAndStyle: true,

  // ======================
  // 文件覆盖设置（针对特定文件类型）
  // ======================
  overrides: [
    {
      files: '*.{css,scss,less}',
      options: {
        singleQuote: false,
      },
    },
    {
      files: '*.json',
      options: {
        tabWidth: 2,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
      },
    },
    {
      files: '*.vue',
      options: {
        parser: 'vue',
        htmlWhitespaceSensitivity: 'ignore',
      },
    },
    {
      files: '*.{jsx,tsx}',
      options: {
        bracketSameLine: true,
      },
    },
  ],
};

// 关键改动：将 CommonJS 的 module.exports 改为 ES Module 的 export default
export default config;
