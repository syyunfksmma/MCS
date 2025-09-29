# Phase 2 산출물 - Hosting & Operations 설계

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
