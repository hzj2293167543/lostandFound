import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('正在收集项目中的拼写错误单词...');

const wordsSet = new Set(['\n']);
const cspell = spawn('cspell', ['**/*', '--no-progress', '--unique', '--wordsOnly'], {
    // 忽略stderr，避免干扰
    stdio: ['pipe', 'pipe', 'ignore'],
    shell: true,
    // Windows下隐藏子进程窗口
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
    const uniqueWords = [...wordsSet].toSorted();
    const outputPath = path.join(process.cwd(), '.cspell/project-words.txt');
    const dir = path.dirname(outputPath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.appendFileSync(outputPath, uniqueWords.join('\n'), 'utf-8');

    if (uniqueWords.length > 0) {
        console.log(`✅ 成功收集了 ${uniqueWords.length} 个拼写检查未通过的单词到 ${outputPath}`);
        console.log('📋 建议将这些单词添加到 .cspell.json 的 "words" 数组（如果是正确的技术术语）');
    } else {
        console.log('✅ 没有发现拼写错误单词');
    }
    // 总是成功退出
    process.exit(0);
});

cspell.on('error', (err) => {
    console.error('❌ 执行cspell失败:', err.message);
    console.log('请确保已安装cspell: pnpm add -D cspell');
    process.exit(1);
});
