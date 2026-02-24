import fs from 'fs';
import path from 'path';

const stagedPath = path.join(process.cwd(), '.cspell/.staged-words.txt');
const wordsPath = path.join(process.cwd(), '.cspell/project-words.txt');

// 检查暂存文件是否存在
if (!fs.existsSync(stagedPath)) {
  console.log('⚠️  没有找到暂存的拼写错误单词');
  console.log('💡 请先运行: pnpm run spell:collect');
  process.exit(0);
}

console.log('📝 正在批量添加单词到项目字典...');

// 读取暂存的单词
const stagedContent = fs.readFileSync(stagedPath, 'utf-8');
const stagedWords = stagedContent
  .split('\n')
  .map((w) => w.trim())
  .filter((w) => w && !w.startsWith('#'));

if (stagedWords.length === 0) {
  console.log('⚠️  暂存文件为空');
  process.exit(0);
}

// 读取现有字典
let existingWords = new Set();
if (fs.existsSync(wordsPath)) {
  const wordsContent = fs.readFileSync(wordsPath, 'utf-8');
  wordsContent
    .split('\n')
    .map((w) => w.trim())
    .filter((w) => w && !w.startsWith('#'))
    .forEach((w) => existingWords.add(w));
}

// 过滤掉已存在的单词
const newWords = stagedWords.filter((w) => !existingWords.has(w));

if (newWords.length === 0) {
  console.log('✅ 所有单词已存在于项目字典中');
  // 删除暂存文件
  fs.unlinkSync(stagedPath);
  process.exit(0);
}

// 追加新单词到字典
const wordsToAdd = '\n# Auto-added words\n' + newWords.join('\n') + '\n';
fs.appendFileSync(wordsPath, wordsToAdd, 'utf-8');

console.log(`✅ 成功添加 ${newWords.length} 个新单词:`);
newWords.forEach((word) => console.log(`   + ${word}`));

// 删除暂存文件
fs.unlinkSync(stagedPath);
console.log(`\n🗑️  已清理暂存文件`);
console.log(`📚 项目字典: ${wordsPath}`);
