# Phase 10 산출물 - 모니터링 & 알람 계획
> ~~이전 버전: Windows 인증/IIS 기반 구성~~

## 1. 모니터링 구성
| 영역 | 도구 | 지표 |
|---|---|---|
| 애플리케이션 | pm2 monit / winston 로그 | SSR 응답시간, 에러율 |
| 인증 | logs/auth 분석 스크립트 | 가입/승인/로그인 성공률, 실패 사유 |
| 서버 리소스 | Windows 성능 모니터, PowerShell | CPU, 메모리, 디스크 I/O |
| 사용자 체감 | Lighthouse, Web Vitals | LCP/FID/CLS |

## 2. 알람 규칙 (예시)
| 조건 | 알림 대상 | 액션 |
|---|---|---|
| /healthz 실패 3회 | Dev + Ops | 서비스 재시작 또는 롤백 검토 |
| 이메일 발송 실패율 > 5% | Dev | SMTP 자격 증명 점검, 재시도 |
| 업로드 오류 3회/10분 | Dev | 로그 분석, 코드 핫픽스 |
| CPU > 85% 5분 지속 | Ops | 백그라운드 프로세스 점검 |

## 3. 대시보드/리포트
- `logs/app/server.log` Tail + 일일 요약 (PowerShell 스크립트).
- `logs/auth/*.log` → 주간 리포트(`reports/auth-summary-YYYYMMDD.csv`).
- Lighthouse CI 결과(`reports/lighthouse/`)를 주간 비교.

## 4. 운영 절차
1. 알람 발생 → 즉시 Slack/Email로 통보.
2. 10분 내 1차 대응(서비스 재시작, SMTP 검증 등).
3. 30분 내 원인 파악 후 Sprint 로그에 기록.
4. 주간 회의에서 알람 임계값 재검토.

## 5. TODO
- `scripts/monitoring/summarize-auth-log.ps1` 작성.
- pm2 healthcheck 템플릿 작성 및 문서화.
- Lighthouse 결과를 Excel/Notion에 자동 업로드.
