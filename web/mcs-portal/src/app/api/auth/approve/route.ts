import { NextResponse } from 'next/server';
import { getUsers, writeUsers, logAuthEvent } from '@/lib/authStore';

const ADMIN_TOKEN = process.env.ADMIN_APPROVAL_TOKEN;

export async function POST(request: Request) {
  const { email, token } = await request.json().catch(() => ({ email: '', token: '' }));
  if (!ADMIN_TOKEN) {
    return NextResponse.json({ error: '관리자 토큰이 설정되지 않았습니다.' }, { status: 500 });
  }
  if (token !== ADMIN_TOKEN) {
    return NextResponse.json({ error: '관리자 토큰이 올바르지 않습니다.' }, { status: 401 });
  }
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: '이메일을 입력하세요.' }, { status: 400 });
  }
  const normalized = email.trim().toLowerCase();
  const users = await getUsers();
  const user = users.find((u) => u.email === normalized);
  if (!user) {
    return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
  }
  user.status = 'approved';
  user.updatedAt = new Date().toISOString();
  await writeUsers(users);
  await logAuthEvent(`approve email=${normalized}`);
  return NextResponse.json({ status: 'approved', email: normalized });
}
