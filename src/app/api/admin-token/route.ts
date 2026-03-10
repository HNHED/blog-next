import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * GET /api/admin-token
 * 服务端校验 NextAuth session，生成 HMAC-SHA256 签名头返回给客户端组件使用。
 * 密钥 (ADMIN_SECRET) 仅在服务端使用，永远不会下发到浏览器。
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json({ error: '服务器配置错误' }, { status: 500 });
  }

  const email = session.user.email;
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${email}:${timestamp}`)
    .digest('hex');

  return NextResponse.json({
    'x-admin-email': email,
    'x-admin-timestamp': timestamp,
    'x-admin-signature': signature,
  });
}
