# 절대 지령
- 각 단계는 승인 후에만 진행한다.
- 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
- 오류 발견 시 수정 전에 승인 재요청한다.
- 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
- 모든 단계 작업은 백그라운드 방식으로 수행한다.
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
- 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
- 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
- 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.

> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, ~~docs/Tasks_ML_Routing.md~~ (폐기 2025-09-30)  
> Remaining Tasks: 0

## 절대 지령
- 각 단계는 승인 후에만 진행한다.
- 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
- 오류 발견 시 수정 전에 승인 재요청한다.
- 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
- 모든 단계 작업은 백그라운드 방식으로 수행한다.
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
- 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
- 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
- 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.
# 보안 테스트 결과 보고서 (Wave14)

## 시험 개요
- **일시**: 2025-09-29 15:40~16:10 KST
- **범위**: AD 통합, SQL Injection, XSS, CSRF
- **도구**: Burp Suite Pro, OWASP ZAP, custom PowerShell scripts
- **담당**: Codex (테스트), IT 보안 검토

## 요약
| 테스트 | 결과 | 비고 |
| --- | --- | --- |
| AD 인증/권한 | 통과 | MFA + Conditional Access 정책 정상 작동 |
| SQL Injection | 통과 | Prepared statement + ORM parameter binding 확인 |
| XSS | 통과 | React DOM Sanitization + Content-Security-Policy 적용 |
| CSRF | 통과 | Anti-forgery token + SameSite=strict 쿠키 확인 |

## 상세 결과
### 1. AD 인증/권한
- Azure AD 접속 로그(`AuditLogs`) 확인 → 비정상 로그인 없음.
- RBAC Role 변경 → Feature Flag 페이지 Admin만 접근 허용.

### 2. SQL Injection
- `POST /api/routing/search`에 `' OR 1=1 --` 페이로드 → 400 반환.
- EF Core 로그에서 Parameterized Query 확인.

### 3. XSS
- 업로드 메타 필드에 `<script>alert(1)</script>` → HTML Escape 처리, UI 표시 시 무해화 검증.
- CSP 헤더: `default-src 'self'; frame-ancestors 'none';` 확인.

### 4. CSRF
- 인증 토큰 미포함 POST 요청 → 401 + `X-CSRF-Token` 헤더 요구.
- SameSite=strict 쿠키 설정으로 cross-site 요청 차단.

## 증적
- `reports/wave14/security/ad_audit_20250929.csv`
- `reports/wave14/security/sql_injection_test.log`
- `reports/wave14/security/xss_result.mp4`
- `reports/wave14/security/csrf_trace.har`

## 개선 항목
- CSP에 `report-to` 설정 추가하여 위반 로그 수집.
- 주기적(분기)으로 AD Conditional Access 정책 재검토.
- PenTest 범위 확장을 위해 2025-10-05 외부 감사 의뢰 예정.

