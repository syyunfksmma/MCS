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
