> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, docs/Tasks_ML_Routing.md  
> Remaining Tasks: 0

## 절대 지령
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
# MCMS Onboarding Tutorial Checklist — Sprint 7

## 1. 온스크린 가이드 점검 항목
- [x] ~~로그인 후 사용자 승인 상태 안내 배너~~ (2025-09-29 Codex, section 4.1)
- [x] ~~Explorer 필터 레일 툴팁~~ (2025-09-29 Codex, section 4.2)
- [x] ~~Hover Quick Menu 소개(실제 구현 완료 시 업데이트)~~ (2025-09-29 Codex, section 4.3)
- [x] ~~Workspace 업로드 안내~~ (2025-09-29 Codex, section 4.4)

## 2. 테스트 계획
- Playwright 온보딩 시나리오 작성 (Sprint7_Log에 기록 예정)
- Axe 접근성 확인

## 3. 후속 작업
- 콘텐츠 업데이트 일정: Sprint7 Week2
- Responsible: Codex

*Draft — 2025-09-29 12:07 KST*
## 4. Tutorial Content Drafts
### 4.1 로그인 후 사용자 승인 상태 안내 배너
- Location: `/auth/verify-email` onboarding banner.
- Messaging: "현재 승인 대기 상태입니다. Ops 팀이 이메일을 확인하는 동안 Explorer 기능은 읽기 전용입니다."
- Visual: Ant Design `Alert` (info) + link to support FAQ.

### 4.2 Explorer 필터 레일 툴팁
- Tooltip copy: "필터 기능은 FR-9 배포 이후 활성화됩니다. Teamcenter 스타일 레이아웃을 미리 확인하세요."
- Placement: `ProductFilterPanel` info icon (hover/focus) with keyboard hints.

### 4.3 Hover Quick Menu 소개
- 강조: Quick Menu (열기/상세/다운로드) + 단축키 `Alt+Shift+O/A/D`.
- 자료: `videos/Explorer_QuickMenu.gif` 첨부.

### 4.4 Workspace 업로드 안내
- 단계: Routing 선택 → Drag & Drop → Checksum 확인 → Ready 체크박스 활성화.
- 유의: Chunk upload 재시도(2회) 및 checksum toast 문구.


