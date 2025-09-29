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
# Phase 10 산출물 - 롤백 전략
> ~~이전 버전: Windows 인증/IIS 기반 구성~~

## 1. 전략 비교
| 전략 | 장점 | 단점 |
|---|---|---|
| Git Revert + npm restart | 실행이 단순, 추가 인프라 필요 없음 | 서비스 잠시 중단(수 초) |
| pm2 graceful reload | 짧은 다운타임, 로그 유지 | pm2 프로세스 관리 필요 |
| Backup 폴더 복원 | 파일 수준 복구 | 백업이 오래되면 데이터 차이 발생 |

**결정**: Git Revert + npm restart를 1차 롤백 수단으로 사용, pm2 graceful reload를 보조 전략으로 유지.

## 2. 롤백 절차 (Git Revert)
1. `git status`로 배포 브랜치 확인 → `git log --oneline`으로 이전 커밋 체크.
2. `git revert <deploy_commit_hash>` 실행 (또는 `git checkout <previous_tag>`).
3. `npm run build` → `npm run start -- -p 4000` 재실행.
4. `/healthz` 및 주요 화면 스모크 테스트.
5. `logs/deploy/YYYYMMDD.log`에 롤백 시간/원인/결과 기록.

## 3. pm2 기반 롤백
1. `npx pm2 stop mcms`.
2. `robocopy backup/YYYYMMDD .next /MIR` 등으로 이전 빌드 복사.
3. `npx pm2 start mcms` → `npx pm2 logs mcms`로 상태 확인.

## 4. 후속 조치
- 장애 원인 분석 → Sprint6_Log.md에 회고 작성.
- 이메일 인증 실패/SMTP 오류가 원인인 경우 SMTP 자격 증명 갱신.
- 필요 시 `npm run test:regression` 재실행으로 회귀 검증.

## 5. TODO
- `scripts/deploy/rollback-local.ps1` 작성 (git revert + npm start 자동화).
- pm2 프로세스 목록/로그 백업 스크립트 추가.
- 롤백 훈련을 분기마다 1회 수행.

