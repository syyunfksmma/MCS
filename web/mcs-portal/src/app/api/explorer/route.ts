import { NextResponse } from 'next/server';
import { fetchExplorerData } from '@/lib/explorer';

export async function GET() {
  const payload = await fetchExplorerData();
  return NextResponse.json(payload, { status: 200 });
}
