"use client";

import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "로그인에 실패했습니다.");
      }
      setMessage("로그인 성공! 세션이 설정되었습니다.");
      setEmail("");
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" });
    setMessage("로그아웃되었습니다.");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold">이메일 로그인</h1>
        <p className="text-sm text-gray-600">
          관리자가 승인한 이메일만 로그인할 수 있습니다.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            className="w-full border rounded px-3 py-2"
            placeholder="approved@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-60"
          >
            {submitting ? "확인 중..." : "로그인"}
          </button>
        </form>
        <button
          onClick={handleLogout}
          className="text-sm text-blue-600 underline"
        >
          로그아웃
        </button>
        {message ? (
          <p className="text-sm text-gray-800 bg-gray-100 p-3 rounded">{message}</p>
        ) : null}
      </div>
    </main>
  );
}
