// rollup.config.js
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import fs from 'fs';

// 使用import.meta.url获取package.json的正确路径
const packageJsonPath = new URL('./package.json', import.meta.url);
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const buildOptions = packageJson.buildOptions || {
    name: packageJson.name,
    formats: ['esm', 'cjs'],
};

// 生成输出配置
const generateOutputConfigs = () => {
    const outputs = [];

    if (buildOptions.formats.includes('esm')) {
        outputs.push({
            file: './dist/index.js',
            format: 'esm',
            sourcemap: true,
            exports: 'named',
        });
    }

    if (buildOptions.formats.includes('cjs')) {
        outputs.push({
            file: './dist/index.cjs',
            format: 'cjs',
            sourcemap: true,
            exports: 'named',
        });
    }

    if (buildOptions.formats.includes('iife')) {
        outputs.push({
            file: './dist/index.iife.js',
            format: 'iife',
            sourcemap: true,
            name: buildOptions.name.replace(/^@monorepo\//, ''),
            exports: 'named',
        });
    }

    if (buildOptions.formats.includes('ts')) {
        // 复制TypeScript源代码到dist目录
        outputs.push({
            file: './dist/index.ts',
            format: 'esm',
            sourcemap: false,
            exports: 'named',
            // 使用插件来复制TypeScript文件
        });
    }

    return outputs;
};

export default defineConfig({
    input: './src/index.ts',
    output: generateOutputConfigs(),
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
            declaration: true,
            declarationDir: './dist/types',
        }),
    ],
});
