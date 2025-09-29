"use client";

import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "요청에 실패했습니다.");
      }
      setMessage(`가입 요청이 접수되었습니다. 관리자 승인 후 로그인 가능합니다. (상태: ${data.status})`);
      setEmail("");
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold">이메일 가입 요청</h1>
        <p className="text-sm text-gray-600">
          이메일을 제출하면 관리자에게 승인 요청이 전달됩니다. 승인 후 로그인 페이지에서 동일한 이메일로 로그인하십시오.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            className="w-full border rounded px-3 py-2"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
          >
            {submitting ? "요청 중..." : "가입 요청"}
          </button>
        </form>
        {message ? (
          <p className="text-sm text-gray-800 bg-gray-100 p-3 rounded">{message}</p>
        ) : null}
      </div>
    </main>
  );
}
