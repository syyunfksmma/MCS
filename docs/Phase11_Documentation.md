# Phase 11 - 문서화 및 핸드오프 계획

## 1. 시스템 문서 정리
- 아키텍처 문서: `docs/Phase2_Architecture.md` 보강 → 최신 다이어그램, 흐름 설명 추가.
- API 명세: Swagger JSON → `docs/api/MCMS_openapi.json` (생성 예정), 주요 엔드포인트 요약 표.
- 데이터 모델: ERD (예: dbdiagram.io) 내보내기 → `docs/data/MCMS_ERD.png` 저장.

## 2. 관리자/사용자 매뉴얼
- 관리자(Admin)
  - 설치/업데이트 절차, 권한 설정, 로그 확인, CMD 서비스 사용법.
  - 문제 해결 FAQ.
- 일반 사용자(Editor/Viewer)
  - 로그인, 품목/Rev 조회, Routing 생성, 파일 업로드, 승인 요청.
  - 스크린샷/툴팁, 주니어 친화 문구.
- 품질/Approver
  - 승인 플로우, 이력 조회, 변경 코멘트 작성.

## 3. 온보딩 자료
- 짧은 동영상(3~5분) 스크립트: 메인 화면 투어, Routing 편집, 이력 조회.
- Quick Start 카드: 1페이지 요약, 단축키/팁 포함.
- 교육 일정: 파일럿 UAT 주간에 맞춰 2회 세션 (AM/PM).

## 4. 유지보수 백로그 정리
- Must-have: 로그 중앙화, meta.json 버전 관리, Grafana 구축.
- Should-have: LiteDB vs SQLite 결정, CmdHost 명령 승인 UI.
- Could-have: 웹 클라이언트 PoC, 모바일 알림.
- Icebox: AI 기반 CAM 추천, SolidWorks 자동 업로드.

## 5. 핸드오프 체크리스트
- [x] ~~코드/문서 저장소 인수인계.~~ (2025-09-29 Codex, docs/phase11/Handoff_Bundle.md)
- [x] ~~CI/CD 파이프라인 접근 권한 전달.~~ (2025-09-29 Codex, docs/phase11/CI_CD_Transfer_Guide.md)
- [x] ~~서비스 계정/인증서 만료 일정 공유.~~ (2025-09-29 Codex, docs/phase11/Ops_LogMetrics_Bundle.md)
- [x] ~~운영 연락망 & 에스컬레이션 경로 문서화.~~ (2025-09-29 Codex, docs/phase11/Ops_Procedures.md)

## 6. 주니어 개발자 참고
- 모든 문서는 `docs/README.md`에서 링크 제공.
- PRD 및 구조 이미지는 최신 버전으로 교체 시 기록 남기기.
- 문서 변경 시 Pull Request 템플릿 사용 (요약/검증 리스트 포함).

## 7. 오픈 이슈
- 동영상 제작 도구 선정 (Stream vs 사내 스튜디오).
- ERD 작성 담당자 (DBA) 확정.
- Quick Start 카드 디자인 협업 필요 (UI 팀).
