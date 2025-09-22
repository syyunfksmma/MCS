# Phase 2 산출물 - Hosting & Operations 설계

## 1. 물리 구성
| 구성 | 설명 |
|---|---|
| Web Frontend Server | Windows Server 2019, IIS + ARR, Node.js 20, Next.js 서비스 |
| API Server | 기존 MCMS API IIS 서버 (변경 없음) |
| Worker Server | 기존 MCMS Workers Windows Service |
| DB/File | SQL Server, W:\ 공유 드라이브 |

## 2. 배포 방식
- Next.js 빌드: `npm ci` → `npm run lint` → `npm run build`
- 아티팩트: `.next`, `package.json` 등 압축 → 서버로 복사
- 서버 측 배포 스크립트: PowerShell + PM2 또는 NSSM
  - `Stop-Service MCMS.NextPortal`
  - 파일 교체
  - `Start-Service MCMS.NextPortal`
- Health Check: `/healthz` (Next.js custom API Route), 30초 간격 모니터링

## 3. IIS Reverse Proxy 설정
- Hostname: `https://portal.mcms.local`
- Rewrite Rule: HTTPS → `http://localhost:3100`
- ARR Sticky Session 비활성
- Compression: Response Compression 활성
- Request Filtering: 업로드 최대 4GB (청크 업로드 시 API로 전환)

## 4. 프로세스 관리 옵션
| 옵션 | 장점 | 단점 | 후보 |
|---|---|---|---|
| NSSM Windows Service | 단순, 기존 Ops 팀 친숙 | 로그 관리 수동 | **우선 고려** |
| PM2 Windows Service | 재시작/클러스터/로깅 지원 | Windows 환경 추가 설정 필요 | 후보 |
| Node Windows Service (custom) | 자유도 높음 | 유지보수 부담 | 비추천 |

## 5. 모니터링/로깅
- 프로세스 상태: Windows Service Manager + Prometheus Exporter
- 애플리케이션 로그: winston → JSON → Logstash/ELK
- Metrics: Next.js SSR 응답시간, Cache Hit, SignalR 연결 수
- Alerts: 응답시간 2초↑, Error Rate 5%↑, Health Check 실패 연속 3회

## 6. 백업/복구 전략
- 코드 아티팩트: Artifactory/ 내부 저장소에 버전 관리
- 구성 파일(.env): Azure Key Vault 또는 사내 비밀 저장소
- 재배포: 이전 버전 아티팩트 롤백 스크립트 제공
- 재해 복구: Secondary 서버에 동일 환경 standby, DNS 전환 준비

## 7. 보안/접근 권한
- 서버 접근: Infra 팀 전용 Jump Box, MFA 필수
- 서비스 계정: Node 서비스 실행용 도메인 계정 (읽기 전용)
- HTTPS 인증서: 사내 CA에서 발급, Auto-renew 스크립트
- 로그 접근: Ops 팀 전용, 개인정보 마스킹 적용

## 8. 운영 Runbook To-do
- Next.js 서비스 재시작 절차 상세화
- 로그 위치/로테이션 방법 문서화
- Capacity Plan (동시 사용자 증가 시 scale-up 전략)
