# Magic Link Email Policy

## 1. Content Template
- Subject: `[MCMS] Sign-in link for {userDisplayName}`
- Body (HTML):
```
<p>안녕하세요 {userDisplayName} 님,</p>
<p>MCMS Web Portal 접속을 위해 아래 버튼을 클릭하세요.</p>
<p><a href="https://mcms.corp/auth/magic?token={token}" style="background:#1A6AF4;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">지금 로그인</a></p>
<p>유효기간: {expiresAt} (15분)</p>
<p>요청하지 않은 로그인이라면 즉시 Ops 팀에 알려주세요.</p>
```
- Plain text fallback 포함.

## 2. Resend Policy
- 15분 이내 3회까지 재전송 허용.
- 재전송 시 기존 토큰 폐기 후 신규 토큰 발급.

## 3. SolidWorks Upload Approval
- Magic Link와 연동된 승인 이메일에는 업로드 승인 조건 명시:
  - 파일명 규칙 준수
  - SHA256 hash 검증 통과 필요

## 4. Logging
- 모든 이메일 전송은 `notify-deploy.ps1` jsonl 로그에 기록하며, `docs/logs/Timeline_YYYY-MM-DD.md`에 요약.

Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Magic Link 정책 초안 |
