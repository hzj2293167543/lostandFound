import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '@lostfound/shared';
import { useAuthStore } from '@/stores/AuthStore';
import { EVENT } from '@/constants/events';

interface AppConfig {
  apiBaseUrl: string;
  wsUrl: string;
  wsPath: string;
  staticBaseUrl: string;
}

let appConfig: AppConfig;

async function loadConfig(): Promise<AppConfig> {
  if (appConfig) return appConfig;
  try {
    const res = await fetch('/config.json');
    appConfig = await res.json();
  } catch {
    appConfig = {
      apiBaseUrl: '/api',
      wsUrl: '',
      wsPath: '/notifications/socket.io',
      staticBaseUrl: '',
    };
  }
  return appConfig;
}

export async function getApiBaseUrl(): Promise<string> {
  const config = await loadConfig();
  return config.apiBaseUrl || '/api';
}

export async function getWsConfig(): Promise<{ wsUrl: string; wsPath: string }> {
  const config = await loadConfig();
  return { wsUrl: config.wsUrl, wsPath: config.wsPath || '/notifications/socket.io' };
}

export async function getStaticBaseUrl(): Promise<string> {
  const config = await loadConfig();
  return config.staticBaseUrl || '';
}

// 创建 axios 实例（延迟初始化）
let clientInstance: AxiosInstance | null = null;

async function getClient(): Promise<AxiosInstance> {
  if (clientInstance) return clientInstance;

  const baseURL = await getApiBaseUrl();
  clientInstance = axios.create({
    baseURL,
    timeout: 10000,
  });

  // 请求拦截器
  clientInstance.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 响应拦截器
  clientInstance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<unknown>>) => {
      const { code, message, data } = response.data;
      if (code === 200) {
        return data as unknown as AxiosResponse<unknown>;
      }
      const error = new Error(message || '请求失败');
      return Promise.reject(error);
    },
    (error) => {
      if (error.response) {
        const { status, data } = error.response;
        const message = data?.message || error.message || '请求失败';

        if (status === 401) {
          useAuthStore.getState().logout();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        } else if (status === 403 && data?.bizCode === 'Banned') {
          useAuthStore.getState().logout();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          window.dispatchEvent(
            new CustomEvent(EVENT.APP_ERROR_TOAST, { detail: { message: data.message } })
          );
        }
        return Promise.reject(new Error(message));
      } else if (error.request) {
        console.error('网络错误，请检查网络连接');
      }
      return Promise.reject(error);
    }
  );

  return clientInstance;
}

// 封装的请求方法
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const client = await getClient();
  return client.get(url, config) as Promise<T>;
};

export const post = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const client = await getClient();
  return client.post(url, data, config) as Promise<T>;
};

export const put = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const client = await getClient();
  return client.put(url, data, config) as Promise<T>;
};

export const remove = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const client = await getClient();
  return client.delete(url, config) as Promise<T>;
};

export const patch = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const client = await getClient();
  return client.patch(url, data, config) as Promise<T>;
};

// 保留直接导出 client 的方式（用于需要直接访问 axios 实例的场景）
export { getClient as client };
