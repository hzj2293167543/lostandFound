// rollup.config.js
import { defineConfig } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import vue from 'rollup-plugin-vue';
import scss from 'rollup-plugin-scss';

export default defineConfig({
    input: './src/index.ts',
    output: [
        {
            file: './dist/index.js',
            format: 'esm',
            sourcemap: true,
            name: 'Components',
        },
        {
            file: './dist/index.cjs',
            format: 'cjs',
            sourcemap: true,
            name: 'Components',
        },
    ],
    plugins: [
        nodeResolve({
            extensions: ['.ts', '.js', '.vue'],
            modulesOnly: true,
        }),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            declaration: false,
            // 只编译为JavaScript，不生成类型声明（已经通过tsc生成）
        }),
        scss({
            output: 'dist/styles.css',
            failOnError: true,
            sassOptions: {
                includePaths: ['node_modules'],
            },
        }),
        vue({
            target: 'browser',
            css: true,
            exposeFilename: false,
            script: {
                jsx: 'preserve',
            },
        }),
        json(),
    ],
    external: ['vue'],
});
