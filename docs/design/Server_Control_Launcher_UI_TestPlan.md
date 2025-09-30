# 절대 지령
- 각 단계는 승인 후에만 진행한다.
- 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
- 오류 발견 시 수정 전에 승인 재요청한다.
- 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
- 모든 단계 작업은 백그라운드 방식으로 수행한다.
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
- 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
- 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
- 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.

# Server Control Launcher UI Test Scenarios (Draft 2025-09-30)

## Hover / Focus Scenarios
1. **Service Card Hover**
   - 요소: API-A/B/Web 카드
   - 기대 결과: 카드 elevation + border 강조, 상태 배지 색상 유지
2. **Start/Stop Button Hover**
   - 요소: Start All, Stop All, 개별 Start/Stop
   - 기대 결과: 버튼 배경 톤 강화, focus ring가 WCAG AA 충족
3. **Settings Panel Input Focus**
   - 요소: Custom URL 입력
   - 기대 결과: border 초록, helper text 업데이트

## Drag & Drop Scenarios
1. **Service List Reorder (추후)**
   - Explorer 재사용 drag handle을 Launcher 카드에 적용 가능성 평가
   - 테스트: 마우스로 카드 드래그 → 포커스 이동 및 순서 유지 확인
2. **Log Panel Scroll Drag**
   - 드래그로 스크롤 시 성능 저하 여부 및 로그 auto-scroll 중단 조건 확인

## Storybook / E2E 케이스 제안
- Storybook: `ServiceCard` 컴포넌트의 상태별(Stopped/Running/Error) hover snapshot
- Playwright: `Start-Stop Flow` 시나리오 (Start All → 헬스 실패 → 재기동 → Stop All)
- Cypress: Settings Panel 커스텀 URL 입력 → 저장 → 재로딩 후 값 유지 검증

## 우선순위
- High: Hover 상태 및 Start/Stop 흐름 (런처 핵심 UX)
- Medium: Drag & Drop 프로토타입, 로그 패널 UX
- Low: 향후 Explorer 재사용 드래그 기능 확장 검토
