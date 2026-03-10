export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3333';

type RequestParam = RequestInit & { __needAuth?: boolean };

/**
 * 生成管理员 HMAC-SHA256 签名请求头
 * - 服务端：直接用 ADMIN_SECRET 签名（密钥保留在服务器）
 * - 客户端浏览器：调用 /api/admin-token 由服务端代理签名（密钥不下发浏览器）
 */
async function generateAdminHeaders(email?: string): Promise<Record<string, string>> {
  if (typeof window === 'undefined') {
    // 服务端环境 (Server Component / Route Handler)
    if (!email) return {};
    const crypto = await import('crypto');
    const timestamp = Date.now().toString();
    const secret = process.env.ADMIN_SECRET!;
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${email}:${timestamp}`)
      .digest('hex');
    return {
      'x-admin-email': email,
      'x-admin-timestamp': timestamp,
      'x-admin-signature': signature,
    };
  } else {
    // 客户端浏览器环境：由 Next.js API 路由完成 session 读取 + 签名，密钥不暴露
    const response = await fetch('/api/admin-token');
    if (!response.ok) throw new Error('获取管理员令牌失败');
    return response.json();
  }
}

async function request(endpoint: string, options: RequestParam = {}) {
  let adminHeaders: Record<string, string> = {};
  const { __needAuth = false, headers: _headers = {}, ...data } = options;

  if (__needAuth) {
    if (typeof window === 'undefined') {
      // 服务端：从 session 获取邮箱后直接签名
      const { auth } = await import("@/auth");
      const session = await auth();
      adminHeaders = await generateAdminHeaders(session?.user?.email || '');
    } else {
      // 客户端：通过 API 路由代理签名
      adminHeaders = await generateAdminHeaders();
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...adminHeaders,
    ..._headers,
  };

  const config = {
    ...data,
    headers,
    next: { revalidate: 3600 },
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `请求失败: ${response.status}`);
    }

    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

// 上传图片（使用 FormData，不设置 Content-Type）
async function uploadImage(file: File): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append('file', file);

  // 通过 API 路由获取签名头（客户端调用）
  const adminHeaders = await generateAdminHeaders();

  const response = await fetch(`${BASE_URL}/upload/image`, {
    method: 'POST',
    headers: adminHeaders,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `上传失败: ${response.status}`);
  }

  return response.json();
}

// 导出快捷方法
export const api = {
  get: (url: string, options?: RequestParam) => request(url, { ...options, method: 'GET' }),
  post: (url: string, body: any, options?: RequestParam) =>
    request(url, { ...options, method: 'POST', body: JSON.stringify(body), __needAuth: true }),
  put: (url: string, body: any, options?: RequestParam) =>
    request(url, { ...options, method: 'PUT', body: JSON.stringify(body), __needAuth: true }),
  delete: (url: string, options?: RequestParam) => request(url, { ...options, method: 'DELETE', __needAuth: true }),
  uploadImage,
};
