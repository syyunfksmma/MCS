import type { VerifyEmailStatus } from "./VerifyEmailClient";
import VerifyEmailClient from "./VerifyEmailClient";

interface VerifyEmailProps {
  searchParams: {
    token?: string;
  };
}

async function validateToken(token?: string): Promise<VerifyEmailStatus> {
  if (!token) {
    return "pending";
  }
  if (token.startsWith("expired")) {
    return "expired";
  }
  return "success";
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailProps) {
  const status = await validateToken(searchParams.token);
  return <VerifyEmailClient status={status} />;
}
