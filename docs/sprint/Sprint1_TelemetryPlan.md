# Sprint 1 - Explorer Telemetry 항목

## 수집 대상
| 이벤트 | 설명 | 수집 방법 |
|---|---|---|
| Explorer 데이터 로딩 | SSR→Hydrate 여부 | Next.js route middleware + React Query events |
| Routing 선택 | 사용자가 선택한 Routing ID | React Query `onSuccess`, custom hook 로깅 |
| Add-in 카드 클릭 | 재시도 버튼 등 상호작용 | Addin Control Panel 이벤트 핸들러 |

## 로그 경로 (PoC)
- 클라이언트 콘솔 + server `console.log` (Phase 1)
- 향후 Elastic APM 또는 Application Insights로 이관 (Phase 8)

## TODO
- React Query `queryClient.setDefaultOptions`에 logger 연동
- SignalR 이벤트에 대한 telemetry 이벤트 정의
