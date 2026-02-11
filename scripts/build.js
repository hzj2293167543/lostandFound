// 统一打包 rollup build脚本
import {
    cleanDistDir,
    getPackages,
    getPackageConfig,
    buildUtilsPackage,
    buildComponentsPackage,
} from './buildBase.js';

// 打包单个包
async function buildPackage(packageDir) {
    console.log(`\n开始打包: ${packageDir}`);

    const packageConfig = getPackageConfig(packageDir);
    const isUtilsPackage = packageConfig.packageDir.includes('utils');
    const isComponentsPackage = packageConfig.packageDir.includes('components');
    const buildOptions = packageConfig.packageJson.buildOptions || {
        name: packageConfig.name,
        formats: ['esm', 'cjs'],
    };

    // 清理dist目录
    cleanDistDir(packageConfig.distDir);

    try {
        if (isUtilsPackage) {
            await buildUtilsPackage(packageConfig, buildOptions);
        } else if (isComponentsPackage) {
            await buildComponentsPackage(packageConfig, buildOptions);
        }

        console.log(`✓ 打包完成: ${packageConfig.name}`);
        return true;
    } catch (error) {
        console.error(`✗ 打包失败: ${packageConfig.name}`);
        console.error(error);
        return false;
    }
}

// 主函数
async function main() {
    console.log('=== 开始打包所有包 ===');

    const packages = getPackages();
    let successCount = 0;
    let totalCount = packages.length;

    // 按依赖顺序构建，确保utils包先被构建
    const utilsPackage = packages.find((pkg) => pkg.includes('utils'));
    const componentsPackage = packages.find((pkg) => pkg.includes('components'));

    // 先构建utils包
    if (utilsPackage) {
        const success = await buildPackage(utilsPackage);
        if (success) {
            successCount++;
        }
    }

    // 然后构建components包
    if (componentsPackage) {
        const success = await buildPackage(componentsPackage);
        if (success) {
            successCount++;
        }
    }

    console.log(`\n=== 打包结果 ===`);
    console.log(`成功: ${successCount}/${totalCount}`);

    if (successCount === totalCount) {
        console.log('✓ 所有包打包成功！');
        process.exit(0);
    } else {
        console.log('✗ 部分包打包失败！');
        process.exit(1);
    }
}

// 执行主函数
await main();
