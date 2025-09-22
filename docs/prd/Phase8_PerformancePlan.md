# Phase 8 산출물 - 성능 측정 및 개선 플랜

## 1. 측정 전략
| 영역 | 도구 | 주기 |
|---|---|---|
| Web Vitals | Lighthouse CI, WebPageTest 사내 에이전트 | 주 1회 |
| Runtime Metrics | Next.js telemetry, Prometheus Exporter | 실시간 |
| 사용자 모니터링 | RUM (Elastic APM Browser) | 지속 |

- Lighthouse CI: `next build && next start` 후 사내 테스트 URL 대상으로 실행
- Threshold: LCP < 2.5s, FID < 100ms, TTFB < 500ms
- CI 실패 시 Slack/Teams 알림 + Jira Performance 티켓 생성

## 2. 개선 액션
- Code Split & Dynamic Import (Explorer/Workspace)
- 이미지 최적화: next/image, AVIF 지원, 캐시 헤더
- 캐싱: React Query staleTime 조정, Edge Cache(Phase 10 검토)
- 서버 튜닝: Node heap/CPU 모니터링, IIS Compression 설정

## 3. 실측 시나리오
- 가장 깊은 라우팅 탐색(100 단계)
- 파일 업로드 후 승인 요청
- Add-in 실패 → 재시도 흐름
- Admin 콘솔에서 사용자 필터링 등

## 4. 보고
- 성능 대시보드(실측 그래프) → Product Owner/Exec Sponsor 공유
- 월간 리뷰: 개선 항목/결과 정리

## 5. TODO
- RUM 도입 시 개인정보 취급 정책 검토
- WebPageTest 에이전트 설치 일정 확정
- Edge Cache 적용 여부 논의(Infra 팀)
