# Phase 6 산출물 - Routing Workspace 계획

## 1. UI 구조
- 좌측: 단계 리스트(DnD), 단계 추가/삭제 버튼
- 우측 탭: 단계 상세, 공정 정보, 공구/설비
- 상단 액션: 저장, 승인 요청, Add-in 파라미터 버튼
- 하단: 파일 업로드/Drag & Drop 박스

## 2. Drag & Drop 기능
- 라이브러리: `@dnd-kit/core`
- 기능: 순서 변경, 단계 복사, 그룹(하위 단계) 지원 TBD
- 키보드 지원: `Space`로 선택, 화살표로 이동, `Enter`로 확정
- 상태 저장: Optimistic 업데이트 → 실패 시 기존 순서 롤백

## 3. 단계 편집
- 필드: Sequence(자동), Machine, Process, Tool, Notes
- Validation: 필수 필드 체크, 중복 Sequence 방지
- Undo/Redo: max 10 step, local state로 관리

## 4. 파일 관리
- 드롭영역: 단계별 파일 업로드(Drag to Stage), meta.json 자동 갱신
- 업로드 Progress → 완료 시 Files tab 리프레시
- 파일 재오더/삭제 UI 제공

## 5. 성능/UX 고려
- 대용량 라우팅(100+ 단계) `virtualized list`
- Auto-save 옵션(탐색 시 경고), 변경 사항 있으면 Unsaved Banner
- 에러 처리: 단계별 오류 표시 + 글로벌 알림

## 6. TODO
- 그룹 단계 지원 여부(PO와 협의)
- Insert 지점 Preview 디자인확정
- 히스토리 기록 포맷 (단계 변경 diff)
