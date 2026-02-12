import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
    input: './src/index.ts',
    output: [
        {
            file: './dist/index.js',
            format: 'esm',
            sourcemap: true,
            exports: 'named',
        },
        {
            file: './dist/index.cjs',
            format: 'cjs',
            sourcemap: true,
            exports: 'named',
        },
        {
            file: './dist/index.iife.js',
            format: 'iife',
            name: 'Utils',
            sourcemap: true,
            exports: 'named',
        },
    ],
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
            declaration: true,
            declarationDir: './dist/types',
        }),
    ],
});
