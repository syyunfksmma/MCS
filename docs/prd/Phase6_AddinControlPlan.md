# Phase 6 산출물 - Add-in Control Panel 계획

## 1. 패널 구조
- 위치: Routing Workspace 우측 탭 또는 Drawer
- 섹션
  1. 현재 큐 상태 (최근 N건)
  2. 작업 상세 (선택된 Job)
  3. 실행/재시도/취소 버튼
  4. 로그 탭 (Worker/History 링크)

## 2. 기능 요건
- ESPRIT Add-in 큐 목록: `GET /api/addin/jobs?status=...`
- Job 재시도: `POST /api/addin/jobs/{jobId}/retry`
- Job 취소: `POST /api/addin/jobs/{jobId}/cancel`
- API 키 재발급: Admin 권한, `/api/addin/keys/renew`
- SignalR 이벤트 수신 → 큐/상태 실시간 업데이트

## 3. UX/피드백
- 작업 상태 배지 + 마지막 메시지 표시
- 재시도 시 Confirm Dialog, 실패 시 오류 코드 노출
- 오프라인 감지: Add-in 연결 끊김 배너
- Add-in 결과에 따른 알림/로그 패널 연동

## 4. 성능 고려
- Polling fallback: 10초 간격
- 큐 데이터 캐싱: React Query, staleTime 5초
- 페이징: 최근 20건만 표시, 더보기 버튼

## 5. TODO
- Retry/Cancel API 확정 (백엔드 협의)
- Add-in 로그 보존 기간 정책 확인
- Panel 레이아웃(Wide/Drawer) 최종 결정
