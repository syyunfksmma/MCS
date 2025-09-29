> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, docs/Tasks_ML_Routing.md  
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
# SSO & Node Hosting Policy Guide (MCMS Web Transition)

## 1. Authentication & Security Policy
- Identity Provider: Azure AD (Hybrid) with conditional access policy MCMS_Web_Tier applied.
- Token Flow: Next.js frontend uses MSAL (PKCE) to acquire tokens; .NET backend validates via Azure AD B2E endpoints.
- Session Lifetime: 60 minutes access token, 8 hour refresh token window. Enforced via PersistentAuth disabled for shared kiosks.
- MFA: Required for all Approver/Admin roles; enforced through Azure AD conditional access.
- TLS: Terminated at IIS reverse proxy with TLS 1.2 minimum, AES-256-GCM suites only; certificates rotated every 6 months (IT Infra owned).

## 2. Node Hosting Standards
| Item | Requirement | Owner |
| --- | --- | --- |
| Runtime | Node.js 20 LTS (managed via nvs), hardened baseline with Windows Defender exclusions documented |
| Process Manager | pm2 service with auto-start (pm2 startup powershell), logs shipped to Loki via promtail |
| Windows Service Wrapper | MCMS-Nextjs service created through NSSM for failover restart |
| Health Checks | /healthz endpoint proxied via IIS Application Request Routing, 30s interval |
| Resource Limits | pm2 ecosystem config sets max_memory_restart: 1024M, cluster mode disabled |

## 3. Deployment Controls
- Release gates require security sign-off to confirm TLS certificate validity and SSO policy compliance.
- Smoke CI run (run-smoke-ci.ps1) must pass before promoting to staging.
- Offline package scripts validated against SHA256 (Compare-FileHash.ps1) prior to distribution.

## 4. Approval Record
| Date | Approver | Notes |
| --- | --- | --- |
| 2025-09-28 | IT Security Lead | Confirmed SSO flow with conditional access mappings |
| 2025-09-28 | IT Infrastructure Manager | Node hosting standards reviewed; pm2 + NSSM approach approved |

## 5. Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Initial policy/hosting guide captured for Phase 0 checklist |

