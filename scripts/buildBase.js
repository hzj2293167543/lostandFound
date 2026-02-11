// 基础构建工具函数
import path from 'path';
import fs from 'fs';

// 清理dist目录
export function cleanDistDir(distDir) {
    if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true, force: true });
    }
    fs.mkdirSync(distDir, { recursive: true });
}

// 执行命令
export async function executeCommand(command, cwd) {
    const { exec } = await import('child_process');

    return new Promise((resolve, reject) => {
        exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`Command failed: ${command}\n${stderr}`));
                return;
            }
            resolve(stdout);
        });
    });
}

// 执行长时间运行的命令（watch模式）
export async function executeWatchCommand(command, cwd, packageName) {
    const { exec } = await import('child_process');

    console.log(`\n开始 ${packageName} 包的watch模式...`);
    console.log(`执行命令: ${command}`);

    const child = exec(command, { cwd });

    child.stdout.on('data', (data) => {
        console.log(`[${packageName}] ${data}`);
    });

    child.stderr.on('data', (data) => {
        console.error(`[${packageName}] ${data}`);
    });

    child.on('close', (code) => {
        console.log(`\n${packageName} 包的watch模式已退出，退出码: ${code}`);
    });

    return child;
}

// 获取所有包的目录
export function getPackages() {
    const packagesDir = path.resolve(process.cwd(), 'packages');

    return fs
        .readdirSync(packagesDir)
        .filter((item) => {
            const itemPath = path.resolve(packagesDir, item);
            return fs.statSync(itemPath).isDirectory();
        })
        .map((item) => path.resolve(packagesDir, item));
}

// 获取包的配置信息
export function getPackageConfig(packageDir) {
    const packageJsonPath = path.resolve(packageDir, 'package.json');
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    const srcDir = path.resolve(packageDir, 'src');
    const distDir = path.resolve(packageDir, 'dist');

    return {
        name: packageJson.name,
        version: packageJson.version,
        main: packageJson.main,
        module: packageJson.module,
        packageDir,
        srcDir,
        distDir,
        packageJson,
    };
}

// 复制TypeScript源代码到dist目录
export function copyTypeScriptSource(srcDir, distDir, packageName) {
    console.log(`正在复制TypeScript源代码到dist目录...`);

    // 复制index.ts文件
    const srcIndexTs = path.resolve(srcDir, 'index.ts');
    const distIndexTs = path.resolve(distDir, 'index.ts');
    fs.copyFileSync(srcIndexTs, distIndexTs);

    // 根据包名复制相应的文件
    if (packageName.includes('utils')) {
        // 复制math.ts和string.ts文件
        const srcMathTs = path.resolve(srcDir, 'math.ts');
        const distMathTs = path.resolve(distDir, 'math.ts');
        if (fs.existsSync(srcMathTs)) {
            fs.copyFileSync(srcMathTs, distMathTs);
        }
        const srcStringTs = path.resolve(srcDir, 'string.ts');
        const distStringTs = path.resolve(distDir, 'string.ts');
        if (fs.existsSync(srcStringTs)) {
            fs.copyFileSync(srcStringTs, distStringTs);
        }
    } else if (packageName.includes('components')) {
        // 复制Test目录下的文件
        const srcTestDir = path.resolve(srcDir, 'Test');
        const distTestDir = path.resolve(distDir, 'Test');
        if (fs.existsSync(srcTestDir)) {
            fs.mkdirSync(distTestDir, { recursive: true });
            const srcTestFiles = fs.readdirSync(srcTestDir);
            for (const file of srcTestFiles) {
                const srcFile = path.resolve(srcTestDir, file);
                const distFile = path.resolve(distTestDir, file);
                fs.copyFileSync(srcFile, distFile);
            }
        }
    }

    console.log(`✓ TypeScript源代码复制完成`);
}

// 构建utils包
export async function buildUtilsPackage(packageConfig, buildOptions) {
    console.log(`正在编译TypeScript文件...`);
    await executeCommand('npx tsc', packageConfig.packageDir);
    console.log(`✓ TypeScript编译完成`);

    console.log(`正在使用Rollup打包...`);
    console.log(`构建格式: ${buildOptions.formats.join(', ')}`);
    await executeCommand('npx rollup -c rollup.config.js', packageConfig.packageDir);
    console.log(`✓ Rollup打包完成`);

    // 如果需要构建ts格式，复制TypeScript源代码到dist目录
    if (buildOptions.formats.includes('ts')) {
        copyTypeScriptSource(packageConfig.srcDir, packageConfig.distDir, packageConfig.name);
    }
}

// 检查Vue配置是否包含data-testid过滤
export function checkVueConfig(packageDir) {
    const viteConfigPath = path.resolve(packageDir, 'vite.config.js');
    const configContent = fs.readFileSync(viteConfigPath, 'utf-8');
    return configContent.includes('data-testid');
}

// 构建components包
export async function buildComponentsPackage(packageConfig, buildOptions) {
    // 检查Vue配置是否包含data-testid过滤
    const hasDataTestIdFilter = checkVueConfig(packageConfig.packageDir);

    // 使用Vite构建Vue组件
    console.log(`正在使用Vite构建Vue组件...`);
    console.log(`构建格式: ${buildOptions.formats.join(', ')}`);
    if (hasDataTestIdFilter) {
        console.log(`移除data-testid属性...`);
    }
    await executeCommand('npx vite build', packageConfig.packageDir);
    console.log(`✓ Vite构建完成`);

    // 单独生成类型声明
    console.log(`正在生成类型声明...`);
    await executeCommand('npx tsc --emitDeclarationOnly', packageConfig.packageDir);
    console.log(`✓ 类型声明生成完成`);

    // 如果需要构建ts格式，复制TypeScript源代码到dist目录
    if (buildOptions.formats.includes('ts')) {
        copyTypeScriptSource(packageConfig.srcDir, packageConfig.distDir, packageConfig.name);
    }
}
