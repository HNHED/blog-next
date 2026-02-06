import { getSession } from "next-auth/react";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3333';

async function request(endpoint: string, options: RequestInit = {}) {
  const session = await getSession();
  const headers = {
    'Content-Type': 'application/json',
    // 自动注入管理员邮箱
    'x-admin-email': session?.user?.email || '',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // 2. 统一处理 HTTP 错误状态
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `请求失败: ${response.status}`);
    }

    // 如果是 204 No Content，直接返回空
    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

// 上传图片（使用 FormData，不设置 Content-Type）
async function uploadImage(file: File): Promise<{ url: string; publicId: string }> {
  const session = await getSession();
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/upload/image`, {
    method: 'POST',
    headers: {
      'x-admin-email': session?.user?.email || '',
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `上传失败: ${response.status}`);
  }

  return response.json();
}

// 3. 导出快捷方法
export const api = {
  get: (url: string, options?: RequestInit) => request(url, { ...options, method: 'GET' }),
  post: (url: string, body: any, options?: RequestInit) =>
    request(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (url: string, body: any, options?: RequestInit) =>
    request(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (url: string, options?: RequestInit) => request(url, { ...options, method: 'DELETE' }),
  uploadImage,
};