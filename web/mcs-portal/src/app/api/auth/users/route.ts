import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/authStore';

export async function GET() {
  const users = await getUsers();
  return NextResponse.json({ users });
}
