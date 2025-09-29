import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getUsers, getSessions, writeSessions, generateId, logAuthEvent } from '@/lib/authStore';

const SESSION_COOKIE = 'mcms_session';

export async function POST(request: Request) {
  const { email } = await request.json().catch(() => ({ email: '' }));
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: '이메일을 입력하세요.' }, { status: 400 });
  }
  const normalized = email.trim().toLowerCase();
  const users = await getUsers();
  const user = users.find((u) => u.email === normalized);
  if (!user) {
    return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
  }
  if (user.status !== 'approved') {
    return NextResponse.json({ error: '승인 대기 중입니다.' }, { status: 403 });
  }

  const sessions = await getSessions();
  const sessionId = generateId('sess');
  const now = new Date().toISOString();
  sessions.push({ id: sessionId, email: normalized, createdAt: now });
  await writeSessions(sessions);
  await logAuthEvent(`login email=${normalized} session=${sessionId}`);

  const response = NextResponse.json({ status: 'ok', email: normalized });
  cookies().set({
    name: SESSION_COOKIE,
    value: sessionId,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 // 1시간
  });
  return response;
}

export async function DELETE() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    const sessions = await getSessions();
    const next = sessions.filter((s) => s.id !== sessionId);
    if (next.length !== sessions.length) {
      await writeSessions(next);
      await logAuthEvent(`logout session=${sessionId}`);
    }
    cookieStore.delete(SESSION_COOKIE);
  }
  return NextResponse.json({ status: 'ok' });
}
