import { NextResponse } from 'next/server';
import { getUsers, writeUsers, logAuthEvent } from '@/lib/authStore';

export async function POST(request: Request) {
  const { email } = await request.json().catch(() => ({ email: '' }));
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: '이메일을 입력하세요.' }, { status: 400 });
  }
  const normalized = email.trim().toLowerCase();
  const users = await getUsers();
  const existing = users.find((u) => u.email === normalized);
  if (existing) {
    return NextResponse.json({ status: existing.status });
  }
  const now = new Date().toISOString();
  users.push({ email: normalized, status: 'pending', createdAt: now, updatedAt: now });
  await writeUsers(users);
  await logAuthEvent(`register pending email=${normalized}`);
  return NextResponse.json({ status: 'pending', email: normalized });
}
