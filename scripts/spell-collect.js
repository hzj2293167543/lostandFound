import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 正在收集项目中的拼写错误单词...');

const wordsSet = new Set();
const cspell = spawn('cspell', ['--dot', '--no-progress', '--unique', '--wordsOnly'], {
  stdio: ['pipe', 'pipe', 'ignore'],
  shell: true,
  windowsHide: true,
});

cspell.stdout.on('data', (data) => {
  const chunk = data.toString();
  chunk.split('\n').forEach((word) => {
    const trimmed = word.trim();
    if (trimmed) wordsSet.add(trimmed);
  });
});

cspell.on('close', () => {
  const uniqueWords = [...wordsSet].sort();

  if (uniqueWords.length === 0) {
    console.log('✅ 没有发现拼写错误单词');
    process.exit(0);
  }

  // 保存到临时文件
  const tempPath = path.join(process.cwd(), '.cspell/.staged-words.txt');
  const dir = path.dirname(tempPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(tempPath, uniqueWords.join('\n'), 'utf-8');

  console.log(`📋 发现 ${uniqueWords.length} 个拼写错误单词:`);
  uniqueWords.forEach((word) => console.log(`   - ${word}`));
  console.log(`\n💾 已暂存到: ${tempPath}`);
  console.log('🚀 运行 "pnpm run spell:apply" 批量添加到项目字典');

  process.exit(0);
});

cspell.on('error', (err) => {
  console.error('❌ 执行cspell失败:', err.message);
  process.exit(1);
});
