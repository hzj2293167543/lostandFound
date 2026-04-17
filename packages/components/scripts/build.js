import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const __dirname = import.meta.dirname;
const pkgDir = path.resolve(__dirname, '..');
const distDir = path.join(pkgDir, 'dist');

// 清理 dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 1. vite 构建（自动包含 data-testid 过滤）
console.log('components: vite build...');
execSync('npx vite build', { cwd: pkgDir, stdio: 'inherit' });

// 2. 生成类型声明
console.log('components: vue-tsc...');
execSync('npx vue-tsc --emitDeclarationOnly', { cwd: pkgDir, stdio: 'inherit' });

console.log('✓ components build done');
