import { promises as fs } from 'fs';
import path from 'path';

export type UserStatus = 'pending' | 'approved';

export interface StoredUser {
  email: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StoredSession {
  id: string;
  email: string;
  createdAt: string;
}

const dataDir = path.join(process.cwd(), 'data');
const userFile = path.join(dataDir, 'users.json');
const sessionFile = path.join(dataDir, 'sessions.json');

async function ensureFile(file: string) {
  try {
    await fs.access(file);
  } catch {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, '[]', 'utf-8');
  }
}

export async function getUsers(): Promise<StoredUser[]> {
  await ensureFile(userFile);
  const raw = await fs.readFile(userFile, 'utf-8');
  return JSON.parse(raw) as StoredUser[];
}

export async function writeUsers(users: StoredUser[]) {
  await fs.writeFile(userFile, JSON.stringify(users, null, 2), 'utf-8');
}

export async function getSessions(): Promise<StoredSession[]> {
  await ensureFile(sessionFile);
  const raw = await fs.readFile(sessionFile, 'utf-8');
  return JSON.parse(raw) as StoredSession[];
}

export async function writeSessions(sessions: StoredSession[]) {
  await fs.writeFile(sessionFile, JSON.stringify(sessions, null, 2), 'utf-8');
}

export function generateId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export async function logAuthEvent(message: string) {
  const logDir = path.join(process.cwd(), 'logs', 'auth');
  await fs.mkdir(logDir, { recursive: true });
  const file = path.join(logDir, `${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.log`);
  const line = `[${new Date().toISOString()}] ${message}
`;
  await fs.appendFile(file, line, 'utf-8');
}
