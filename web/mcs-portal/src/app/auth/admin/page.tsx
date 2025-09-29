"use client";

import { FormEvent, useEffect, useState } from "react";

type User = {
  email: string;
  status: "pending" | "approved";
  createdAt: string;
  updatedAt: string;
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const loadUsers = async () => {
    const response = await fetch("/api/auth/users");
    const data = await response.json();
    setUsers(data.users ?? []);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleApprove = async (email: string) => {
    setMessage(null);
    try {
      const response = await fetch("/api/auth/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "승인에 실패했습니다.");
      }
      setMessage(`${email} 승인 완료`);
      await loadUsers();
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setMessage(msg);
    }
  };

  const handleRefresh = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await loadUsers();
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">관리자 승인</h1>
        <form onSubmit={handleRefresh} className="space-y-4">
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="관리자 토큰"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            required
          />
          <div className="flex justify-between">
            <button type="submit" className="bg-gray-200 px-4 py-2 rounded">새로고침</button>
            <span className="text-sm text-gray-500">총 {users.length}명</span>
          </div>
        </form>
        {message ? (
          <p className="text-sm bg-blue-50 text-blue-700 p-3 rounded">{message}</p>
        ) : null}
        <table className="w-full border text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2 text-left">이메일</th>
              <th className="border px-3 py-2 text-left">상태</th>
              <th className="border px-3 py-2">액션</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email}>
                <td className="border px-3 py-2">{user.email}</td>
                <td className="border px-3 py-2">{user.status}</td>
                <td className="border px-3 py-2 text-center">
                  {user.status === "pending" ? (
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => handleApprove(user.email)}
                    >
                      승인
                    </button>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
