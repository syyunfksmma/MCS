# Phase 10 산출물 - 모니터링 & 알람 계획

## 1. 모니터링 구성
| 영역 | 도구 | 지표 |
|---|---|---|
| 애플리케이션 | Grafana + Prometheus | SSR 응답시간, 에러율, SignalR 연결 수 |
| 서버 | Windows Performance Counters | CPU, 메모리, 디스크 I/O |
| 로그 | Elastic Stack | 오류 로그, 감사 로그 |
| 사용자 | RUM (Elastic APM Browser) | LCP/FID/CLS 실측 |

## 2. 알람 규칙 (예시)
| 조건 | 알림 대상 | 액션 |
|---|---|---|
| Health Check 실패 3회 | Ops 팀 | 즉시 롤백 검토 |
| 에러율 > 5% 5분 이상 | Dev + PO | 블록/Hotfix 논의 |
| Add-in 실패 연속 3건 | Add-in Owner | 재시도/워크플로우 점검 |
| CPU > 85% 10분 지속 | Infra + Dev | 스케일 업 또는 원인 분석 |

## 3. 대시보드 구조
- Overview: TTFB, 요청 수, 에러 비율, Add-in 큐 상태
- Explorer/Workspace: 페이지별 응답시간, 캐시 히트율
- Admin/Monitoring: 감사 로그 이벤트 수, Feature Flag 변경 내역
- Infra: 서버 리소스, 서비스 상태

## 4. 운영 절차
- 알람 → Teams 채널 통보 + OpsGenie 티켓
- 15분 내 1차 대응, 30분 내 복구 목표
- 주간 리뷰: 알람 피드백, 임계값 조정

## 5. TODO
- Prometheus Exporter 설치/구성 계획 수립
- Grafana 대시보드 템플릿 제작
- 알람 테스트(스모크) 수행
