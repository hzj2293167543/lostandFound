import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '@lostfound/shared';

// 创建 axios 实例
const client: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

// 请求取消控制器映射，用于处理重复请求
const pendingRequests = new Map<string, AbortController>();

// 生成请求标识
const generateRequestKey = (config: AxiosRequestConfig): string => {
  return `${config.method?.toLowerCase() || ''}-${config.url}-${JSON.stringify(config.params || {})}-${JSON.stringify(config.data || {})}`;
};

// 请求拦截器
client.interceptors.request.use(
  (config) => {
    // 取消重复请求
    const requestKey = generateRequestKey(config);
    if (pendingRequests.has(requestKey)) {
      pendingRequests.get(requestKey)?.abort();
    }
    const controller = new AbortController();
    pendingRequests.set(requestKey, controller);
    config.signal = controller.signal;

    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
client.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    // 移除已完成的请求
    const requestKey = generateRequestKey(response.config);
    pendingRequests.delete(requestKey);

    // 统一处理响应数据
    const { code, message, data } = response.data;
    if (code === 200) {
      // 直接返回业务数据部分
      return data as unknown as AxiosResponse<unknown>;
    }
    // 业务错误，抛出错误
    const error = new Error(message || '请求失败');
    return Promise.reject(error);
  },
  (error) => {
    // 移除已完成的请求
    if (error.config) {
      const requestKey = generateRequestKey(error.config);
      pendingRequests.delete(requestKey);
    }

    // HTTP 错误处理
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || error.message || '请求失败';

      if (status === 401) {
        localStorage.removeItem('token');
        // 避免重复跳转
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(new Error(message));
    } else if (error.request) {
      console.error('网络错误，请检查网络连接');
      // 这里可以添加全局提示
    } else {
      console.error('请求配置错误:', error.message);
      // 这里可以添加全局提示
    }
    return Promise.reject(error);
  }
);

// 封装 GET 请求
export const get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return client.get(url, config) as Promise<T>;
};

// 封装 POST 请求
export const post = <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  return client.post(url, data, config) as Promise<T>;
};

// 封装 PUT 请求
export const put = <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  return client.put(url, data, config) as Promise<T>;
};

// 封装 DELETE 请求
export const remove = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return client.delete(url, config) as Promise<T>;
};

// 导出 axios 实例
export default client;
