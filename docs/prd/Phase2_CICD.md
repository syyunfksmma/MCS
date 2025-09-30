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
# Phase 2 산출물 - 배포/패키징 절차 메모
> ~~이전 버전: Windows 인증/IIS 기반 구성~~

## 1. 개요
- 로컬 PC에서 수동 트리거(버전 태그)로 빌드/배포를 진행한다.
- CI는 선택 사항이며, 기본적으로 `npm run lint`/`npm run test`를 수동 실행한다.

## 2. 단계별 작업 (로컬 빌드)
| 단계 | 작업 | 상세 |
|---|---|---|
| Build | Install & Lint | `npm install`, `npm run lint` |
| Test | Regression | `npm run test:regression` (데이터 리셋 → 시드 → E2E → axe) |
| Package | Build Output | `npm run build` → `.next`, `public` 폴더 | 
| Publish | 로컬 배포 | `npm run start -- -p 4000` 또는 pm2 |
| Verify | Health Check + Manual Smoke | `/healthz`, Explorer/Workspace/Admin |
| Rollback | Git Revert | 이전 커밋 체크아웃 후 재빌드 |

## 3. 자동화 스크립트 개요
```powershell
# scripts/testing/bootstrap-uat.ps1
# scripts/testing/seed-test-data.mjs
# scripts/testing/reset-test-data.mjs
~~# scripts/testing/check-smtp.mjs~~ # (제거됨)
```
- `npm run test:data:reset`
- `npm run test:data:seed`
- `npm run test:regression`

## 4. 배포 고려사항
- 배포 전 `backup/YYYYMMDD/.next` 보관.
- `.env.local` 변경 시 암호화 백업.
- 배포 후 `healthz`와 이메일 인증 흐름을 즉시 확인.

## 5. 비밀/보안
- SMTP 비밀번호, JWT Secret은 `.env.local`에만 저장하고 Git에 커밋 금지.
- 필요 시 `Protect-CmsMessage`로 암호화하여 공유.
- 승인/로그인 이벤트 로그는 이메일 주소를 마스킹 처리.

## 6. 관측성
- 배포 로그: `logs/deploy/YYYYMMDD.log`.
- pm2 사용 시 `npx pm2 logs mcms`로 실시간 확인.
- 주요 지표: 빌드 시간, 이메일 발송 성공률, 헬스체크 응답.

## 7. TODO
- `scripts/deploy/rollback-local.ps1` 작성.
- `npm run smtp:check`를 배포 전 필수 절차로 추가.
- GitHub Actions(옵션)에서 lint/test 파이프라인 템플릿 초안 작성.

---
2025-09-29 Codex: 로컬 PC + 이메일 인증 환경에 맞춰 CI/CD 문서를 단순화.

