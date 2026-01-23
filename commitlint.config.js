// commitlint.config.js (ESM 格式)
export default {
    // 1. 继承行业通用规范
    extends: ['@commitlint/config-conventional'],

    // 2. 自定义规则 (覆盖或扩展继承的规则)
    rules: {
        // 2.1 类型枚举：定义允许的提交类型
        'type-enum': [
            2, // 2 表示错误 (error)，违反此规则将拒绝提交
            'always', // 总是检查
            [
                'feat', // 新功能 (feature)
                'fix', // 修复Bug
                'docs', // 文档更新
                'style', // 代码格式调整（不影响功能）
                'refactor', // 代码重构
                'perf', // 性能优化
                'test', // 增加或修改测试
                'build', // 构建系统或外部依赖变更
                'ci', // CI/CD 配置或脚本变更
                'chore', // 其他杂项（非src或test的修改）
                'revert', // 回滚提交
                'wip', // 临时工作提交（可按需启用）
            ],
        ],

        // 2.2 类型不能为空
        'type-empty': [2, 'never'],
        // 2.3 主题（简述）不能为空
        'subject-empty': [2, 'never'],
        // 2.4 主题（简述）首字母不大写
        'subject-case': [0], // 0 表示关闭此规则，因为中文环境下不适用
        // 2.5 主题（简述）长度限制
        'subject-full-stop': [0, 'never', '.'], // 结尾不要句号
        'subject-max-length': [2, 'always', 100], // 最大长度，防止过长

        // 2.6 正文和脚注的换行格式（通常使用 auto）
        'body-leading-blank': [1, 'always'], // 正文前空一行，1 表示警告
        'footer-leading-blank': [1, 'always'], // 脚注前空一行
        'body-max-line-length': [2, 'always', 200], // 正文行长度限制
        'footer-max-line-length': [2, 'always', 200],

        // 2.7 【Monorepo 关键】Scope 配置：可选的、自定义的范围
        'scope-enum': [
            2,
            'always',
            // 这里定义你的项目/模块范围，例如：
            ['root', 'app', 'pkg', 'ui', 'utils', 'docs', 'config', 'release'],
            // 你可以根据 Monorepo 的子包目录来定义，如：
            // ['apps/*', 'packages/*', 'tooling']
        ],
        'scope-empty': [1, 'never'], // scope 可以为空吗？设为 1 (警告) 或 2 (错误) 按需调整
        'scope-case': [2, 'always', 'lower-case'], // scope 的格式，这里要求全小写
    },

    // 3. 提示信息（当提交信息不符合规则时显示）
    helpUrl: '请遵守提交规范，参考：https://www.conventionalcommits.org/',

    // 4. 【可选】cz-git 适配器的专属配置（如果你使用 commitizen + cz-git）
    // 注意：这部分配置是给 `cz-git` 交互提示使用的，与上面的 commitlint 规则独立但应保持一致。
    prompt: {
        settings: {},
        messages: {
            type: '选择你要提交的变更类型：',
            scope: '指定变更范围（可选，如组件、模块）：',
            customScope: '请输入自定义的变更范围：',
            subject: '写一个简短、命令式的描述：\n',
            body: '提供更详细的说明（可选）。使用 "|" 换行：\n',
            breaking: '列出任何 BREAKING CHANGES（破坏性变更，可选）：\n',
            footerPrefixesSelect: '选择关联的 ISSUE 前缀（可选）：',
            customFooterPrefix: '输入自定义的 ISSUE 前缀：',
            footer: '列出任何 ISSUE 被关闭（可选）。例如：Fixes #123：\n',
            confirmCommit: '确认提交？',
        },
        types: [
            { value: 'feat', name: 'feat:     新功能', emoji: ':sparkles:' },
            { value: 'fix', name: 'fix:      修复Bug', emoji: ':bug:' },
            { value: 'docs', name: 'docs:     文档更新', emoji: ':memo:' },
            { value: 'style', name: 'style:    代码格式', emoji: ':lipstick:' },
            { value: 'refactor', name: 'refactor: 代码重构', emoji: ':recycle:' },
            { value: 'perf', name: 'perf:     性能优化', emoji: ':zap:' },
            { value: 'test', name: 'test:     测试相关', emoji: ':white_check_mark:' },
            { value: 'build', name: 'build:    构建系统', emoji: ':package:' },
            { value: 'ci', name: 'ci:       CI 配置', emoji: ':ferris_wheel:' },
            { value: 'chore', name: 'chore:    杂项任务', emoji: ':wrench:' },
            { value: 'revert', name: 'revert:   回滚提交', emoji: ':rewind:' },
        ],
        useEmoji: false, // 设为 true 可以在提示中显示 emoji，提交信息中也会包含
        themeColorCode: '', // 主题色，留空使用默认
        scopes: [], // 如果在此预定义 scope 列表，将取代上面的 ‘scope-enum’ 数组
        allowCustomScopes: true, // 是否允许输入自定义 scope
        allowEmptyScopes: true, // 是否允许 scope 为空（与 rules 中的 ‘scope-empty’ 对应）
        customScopesAlign: 'bottom',
        customScopesAlias: 'custom',
        emptyScopesAlias: 'empty',
        upperCaseSubject: false,
        markBreakingChangeMode: false,
        allowBreakingChanges: ['feat', 'fix'],
        breaklineNumber: 100,
        breaklineChar: '|',
        skipQuestions: [], // 可以跳过的问题，例如 ['body', 'footer']
        issuePrefixes: [{ value: 'closed', name: 'closed:    ISSUE 已被关闭' }],
        customIssuePrefixAlign: 'top',
        emptyIssuePrefixAlias: 'skip',
        customIssuePrefixAlias: 'custom',
        allowCustomIssuePrefix: true,
        allowEmptyIssuePrefix: true,
        confirmColorize: true,
        maxHeaderLength: 200, // 与 rules 中的 ‘subject-max-length’ 对应
        maxSubjectLength: 100,
    },
};
