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
# Phase 2 산출물 - Hosting & Operations 설계
> ~~이전 버전: Windows 인증/IIS 기반 구성~~

## 1. 물리 구성
| 구성 | 설명 |
|---|---|
| MCMS Portal (로컬) | Windows 11 Pro PC, Node.js 20, Next.js SSR 서비스 |
| MCMS API | 기존 MCMS .NET API (변경 없음) |
| Worker | 기존 MCMS Worker 서비스 |
| DB/File | SQL Server, 공유 드라이브 |

## 2. 배포 방식 (로컬)
1. `git pull` → `npm install`
2. `npm run build`
3. `npm run start -- -p 4000`
4. pm2 사용 시 `npx pm2 start npm --name mcms -- run start -- -p 4000`
5. `/healthz` 호출로 상태 확인 후 로그 기록

## 3. 네트워크/포트 정책
- 로컬 PC 방화벽에서 4000 포트 허용, 외부 포트 포워딩 금지
- 이메일 인증 링크는 `http://<로컬IP>:4000` 또는 ngrok(임시) 사용
- 향후 HTTPS 필요 시 mkcert 등으로 로컬 인증서 발급 검토

## 4. 프로세스 관리 옵션
| 옵션 | 장점 | 단점 |
|---|---|---|
| pm2 | 재시작/로깅 통합, 윈도우 지원 | 설치/학습 필요 |
| PowerShell 스크립트 | 단순, 기본 제공 | 자동 재기동 미지원 |
| 작업 스케줄러 | 부팅 시 자동 시작 | 로그 관리 별도 필요 |

## 5. 모니터링/로깅
- 애플리케이션 로그: `logs/app/server.log`
- 인증 로그: `logs/auth/YYYYMMDD.log`
- 배포 로그: `logs/deploy/YYYYMMDD.log`
- 필수 알람: 서버 다운, 이메일 발송 실패, 업로드 오류

## 6. 백업/복구 전략
- 빌드 아티팩트 백업: `backup/YYYYMMDD/.next`
- `.env.local` 암호화 백업: `Protect-CmsMessage` 활용
- 롤백: git revert + npm run start 절차 준수
- 주간 전체 백업(프로젝트 폴더) 외장 디스크에 보관

## 7. 보안/접근 권한
- 로컬 PC 관리자 계정으로만 서비스 실행
- SMTP 계정 비밀번호는 암호화 파일 + 2FA 지원 메일 서비스 사용
- 로그에 이메일/토큰 등 민감 정보 마스킹

## 8. 운영 Runbook TODO
- `npm run start`/`pm2 restart` 절차 체크리스트 업데이트
- 로그 로테이션 PowerShell 스크립트 작성
- 이메일 발송 실패 시 재시도 정책 문서화

---
2025-09-29 Codex: 로컬 PC(Node.js 20) 기반 Hosting 설계로 전환 및 이메일 인증 운영 시나리오 반영.

