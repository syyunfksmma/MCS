import { NextResponse, type NextRequest } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

const LOG_DIRECTORY = path.resolve(process.cwd(), 'reports');
const LOG_FILE = path.join(LOG_DIRECTORY, 'web-vitals.jsonl');

export async function POST(request: NextRequest) {
  try {
    const metric = await request.json();
    const entry = {
      ...metric,
      receivedAt: new Date().toISOString()
    };
    await fs.mkdir(LOG_DIRECTORY, { recursive: true });
    await fs.appendFile(LOG_FILE, JSON.stringify(entry) + '\n', 'utf8');
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[web-vitals] failed to persist metric', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
