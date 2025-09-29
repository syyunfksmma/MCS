# Sprint 5 UAT Checklist (Explorer & History)

| 구분 | 시나리오 | 예상 결과 | 로그 증적 |
| --- | --- | --- | --- |
| Explorer | 제품 계층 탐색 (Item → Revision → Routing) | 모든 패널이 2초 내 로드, 오류 없음 | Playwright `explorer.spec.ts` 녹화, `workspace-admin.spec.ts` 주석 |
| Workspace | SolidWorks 업로드 흐름 (더미 파일) | 진행률 UI 표시, 업로드 완료 후 히스토리 카드 추가 | `workspace_upload` 스크린샷, seed 로그 |
| Search | Routing 코드 검색 후 상세 보기 | 검색 결과 표에 필터가 적용되고 상세 모달 열림 | Sprint5.1 로그, SLA 캡처 |
| Admin | Feature flag 토글 및 롤백 | 토글 후 Explorer 새로고침 시 플래그 반영, 로그 기록 | Admin Console 캡처 |
| UAT 계정 | 이메일 기반 가입·로그인(Engineer/Reviewer/Admin) | Magic Link 수신 및 권한별 메뉴 노출 | logs/auth, pm2 logs, 역할 스냅샷 |

## 승인 기준
1. 모든 UAT 시나리오가 한 회차 내 Pass (retry 불가).
2. 실패 시 즉시 Sprint5_Log.md에 기록하고 재현 절차 작성.
3. 테스트 데이터는 `npm run test:data:reset` → `npm run test:data:seed` 순서로 초기화.
4. 결과는 `docs/sprint/Sprint5_UAT_Summary.md`에 서명(PO, QA Lead)과 함께 아카이브.
