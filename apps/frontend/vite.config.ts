import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server';
import { defineConfig, loadEnv } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const authToken = env.SENTRY_AUTH_TOKEN;

  const sentryConfig = {
    dsn: env.VITE_SENTRY_DSN || '',
    url: env.VITE_SENTRY_URL || 'https://sentry.io',
    authToken: authToken,
    org: env.SENTRY_ORG || '',
    project: env.VITE_SENTRY_PROJECT || 'javascript-react',
    release: { name: env.npm_package_version || '1.0.0' },
    deploy: { env: env.NODE_ENV || 'production' },
    dryRun: process.env.CI !== 'true',
    sourceMaps: authToken &&
      process.env.CI && {
        include: ['./dist/assets'],
        ignore: ['node_modules'],
        urlPrefix: '~/assets',
      },
  };

  return {
    plugins: [
      react({
        babel: {
          plugins: ['babel-plugin-react-compiler'],
        },
      }),
      tailwindcss(),
      mockDevServerPlugin({
        dir: 'src/mock',
        log: 'info',
        prefix: '^/mock',
      }),

      // oxlint-disable-next-line typescript/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...((mode === 'production' && process.env.CI ? sentryVitePlugin(sentryConfig) : []) as any),
    ],
    build: {
      sourcemap: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      open: true,
      proxy: {
        '^/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
        '^/uploads': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
        '^/socket.io': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          ws: true,
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['__tests__/**/*.test.{ts,tsx}'],
      setupFiles: ['./__tests__/setup/setup.ts'],
    },
  };
});
