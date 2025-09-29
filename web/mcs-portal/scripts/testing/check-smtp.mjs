#!/usr/bin/env node
import { config } from 'dotenv';
import nodemailer from "nodemailer";
import { join } from 'node:path';

config({ path: join(process.cwd(), '.env.local') });

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT ?? 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

if (!host || !user || !pass) {
  console.error("[check-smtp] SMTP credentials are missing");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass }
});

try {
  await transporter.verify();
  console.log(`[check-smtp] SMTP connection verified for ${user}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[check-smtp] verification failed: ${message}`);
  process.exit(1);
}
