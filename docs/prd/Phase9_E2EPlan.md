# Phase 9 산출물 - E2E 테스트 계획

## 1. 도구/환경
- 기본: Playwright (TypeScript), 보조로 Cypress 스모크 테스트
- 실행 환경: Stage Next.js + API Stage 서버
- CI 통합: Azure DevOps nightly + PR optional

## 2. 테스트 시나리오
| ID | 시나리오 | 주요 단계 |
|---|---|---|
| E2E-01 | Explorer 탐색 및 Routing 보기 | 로그인 → Explorer 검색 → Routing 상세 |
| E2E-02 | Routing 수정/승인 | Workspace 편집 → 승인 요청 → Approver 승인 |
| E2E-03 | Add-in 실패 재시도 | 승인 → Add-in 실패 모의 → 재시도 → 성공 |
| E2E-04 | Admin 역할 변경 | Admin Console에서 권한 변경 → 권한 UI 반영 |
| E2E-05 | API 키 재발급 | 키 재발급 → Add-in에서 새로운 키 확인 |
| E2E-06 | 파일 업로드/검증 | 파일 드래그 → 업로드 진행률 → meta.json 갱신 |

## 3. 테스트 데이터
- Fixture 계정: viewer@example.com, editor@example.com, approver@example.com, admin@example.com
- Mock Add-in API: 실패/성공 제어 엔드포인트 제공
- 파일 샘플: 소형/대형 (10MB) 테스트 파일, 해시값 비교

## 4. 자동화 전략
- Playwright Test Runner + Visual Regression(Explorer 트리)
- Retry 정책: flaky 테스트 최대 2회 재시도
- 보고: HTML Report + Allure(선택) → Teams 공유

## 5. 유지보수
- 테스트 케이스 버전관리: `/tests/e2e` 폴더, PR 리뷰 필수
- 실패 시 triage: QA 주관, 24시간 내 RCA 문서화

## 6. TODO
- Playwright Docker 이미지 준비
- Test data reset 스크립트
- 선택형 모바일 뷰 테스트 여부 검토
