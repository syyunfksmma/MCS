# Phase 5 산출물 - Add-in 배지 & 히스토리 UI 계획

## 1. Add-in 상태 배지
- 위치: Routing Explorer 트리 노드, Routing Workspace 요약 카드
- 상태 → 색상/텍스트
  - 완료: Green `완료`
  - 실패: Red `실패`
  - 대기: Amber `대기`
  - 진행중: Blue `진행`
  - 오류: Gray `오류`
- Tooltip: 최근 메시지/에러 코드, 완료/실패 시각
- 디테일 패널: 전체 Add-in 실행 기록(표 + 필터)

## 2. 히스토리 탭
- 레이아웃: Timeline (좌측 시간축, 우측 카드)
- 항목: 승인 이벤트, Add-in 결과, 파일 업로드, 코멘트
- Add-in 기록: 아이콘, 상태 배지, 메시지, 재시도 버튼
- 필터: 이벤트 유형(승인/파일/Add-in), 날짜 범위, 사용자

## 3. 실시간 갱신
- SignalR 이벤트 수신 시
  - Routing Summary 상태 업데이트
  - 히스토리 타임라인 항목 prepend
  - Toast 알림(실패/성공에 따라 메시지)
- Offline Indicator: SignalR 연결 끊김 → 알림 배너 표시

## 4. UX 고려
- Add-in 실패 시 “자세히 보기” 클릭 → 모달에서 로그/재시도
- 성공 시 간단 Toast + 타임라인 업데이트만 (알림 피로 감소)
- 히스토리 항목 확장: 상세 정보(파라미터, 처리 시간)

## 5. TODO
- Add-in 로그 API 확장 필요 여부 검토
- 히스토리 페이징 전략(무한 스크롤 vs 버튼)
- Toast/알림 메시지 문구 확정 (PO와 협의)
