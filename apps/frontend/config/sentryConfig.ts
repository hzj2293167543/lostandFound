import process from 'process';

export default {
  dsn: process.env.VITE_SENTRY_DSN || '',
  url: process.env.VITE_SENTRY_URL || 'https://sentry.io',
  authToken: process.env.SENTRY_AUTH_TOKEN || '',
  org: process.env.SENTRY_ORG || '',
  project: process.env.SENTRY_PROJECT || 'javascript-react',
  release: process.env.npm_package_version || '1.0.0',
  deploy: { env: process.env.NODE_ENV || 'production' },
  setCommits: {
    auto: true,
  },
  sourceMaps: {
    include: ['./dist/assets'],
    ignore: ['node_modules'],
    urlPrefix: '~/assets',
  },
};
