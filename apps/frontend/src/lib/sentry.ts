import * as Sentry from '@sentry/react';
import { browserTracingIntegration, replayIntegration } from '@sentry/react';
import { useAuthStore } from '@/stores/AuthStore';
import type { User } from '@lostfound/shared';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || '';
const SENTRY_ENVIRONMENT =
  import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE || 'production';

function getUserRole(role: number): string {
  switch (role) {
    case 0:
      return '普通用户';
    case 1:
      return '管理员';
    default:
      return '未知';
  }
}

export function initSentry() {
  if (!SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    debug: true,
    integrations: [browserTracingIntegration(), replayIntegration()],
    environment: SENTRY_ENVIRONMENT,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    beforeSend: (event) => {
      const user = useAuthStore.getState().user;
      if (user) {
        event.user = {
          id: user.id.toString(),
          username: user.name,
          email: user.email,
        };
      }
      return event;
    },
  });
}

export function setSentryUser(user: User | null) {
  if (user) {
    Sentry.setUser({
      id: user.id.toString(),
      username: user.name,
      email: user.email,
      extra: {
        role: getUserRole(user.role),
      },
    });
  } else {
    Sentry.setUser(null);
  }
}

export { Sentry };
