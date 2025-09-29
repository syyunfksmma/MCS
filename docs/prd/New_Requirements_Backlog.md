# 신규 요구사항 백로그 (Stage4 준비)

## 수집 소스
- PoC 킥오프 전 유관 부서 인터뷰 (CAM, 품질, IT 보안)
- Jira MCMSNEXT 프로젝트 신규 이슈 (FR-11 ~ FR-18)
- Training/Reporting 팀 전환 요청 메일 (2025-09-28 수신)

## 백로그 테이블
| ID | 유형 | 요청 부서 | 설명 | 영향 범위 | 우선순위 | 예정 Sprint |
| --- | --- | --- | --- | --- | --- | --- |
| FR-11 | 기능 | CAM | Routing Wizard 단계별 승인자 지정 | Web Portal | High | Sprint7 |
| FR-12 | 기능 | 품질 | 품질 승인 시 전자 서명 캡쳐 | API/DB | Medium | Sprint8 |
| FR-13 | 비기능 | IT 보안 | AD MFA 강제, 실패 로그 아카이브 | Auth | High | Sprint6 |
| FR-14 | 데이터 | Reporting | 공유 드라이브 파일 변경 이력 Export | Worker | Medium | Sprint7 |
| FR-15 | 교육 | Training | 신규 사용자 온보딩 투어 모듈 | Web | Low | Sprint9 |
| FR-16 | 통합 | CAM | ESPRIT Add-in 버전 자동 체크 | Add-in | Medium | Sprint8 |
| FR-17 | 운영 | Ops | 설치 자동화 상태 대시보드 | Installers | Medium | Sprint6 |
| FR-18 | 품질 | QA | Selenium Edge 스모크 테스트 추가 | Testing | High | Sprint6 |

## 우선순위 기준
1. 규제/보안 요구 → 최우선 처리.
2. PoC 성공 지표에 직접 연관된 항목 → Sprint6~7 배치.
3. 교육/문서 항목은 Sprint9 이후 배치.

## 의존성 및 Assignee
- FR-11, FR-12: API 계약 업데이트 필요 (design/api 팀 공조).
- FR-13: Azure AD 팀 승인 필요, 보안 감사 증적 첨부.
- FR-17: `scripts/install` 리포트 확장 + Grafana 패널 신설.
- FR-18: 본 Wave에서 테스트 플랜 작성으로 선행 처리.

## 다음 단계
- 2025-09-30 API/Design Sync에서 백로그 검토 → 승인 후 Jira 업데이트.
- 승인된 항목은 MCMS_TaskList Phase 6~8 섹션에 반영.
- 거부/보류 항목은 2025-10-02 Steering Committee에서 재논의.
