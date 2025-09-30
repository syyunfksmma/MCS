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

> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, ~~docs/Tasks_ML_Routing.md~~ (폐기 2025-09-30)  
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

