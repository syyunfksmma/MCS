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

