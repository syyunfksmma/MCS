# Phase 6 산출물 - 승인/반려 워크플로우 테스트 계획

## 1. E2E 시나리오
1. Editor가 Routing 수정 → 저장 → 승인 요청
2. Approver가 알림 → Routing Workspace에서 검토 → 승인
3. Add-in 작업 생성 → Add-in Control Panel에서 상태 확인
4. Worker가 결과 보고 → 배지/히스토리 업데이트
5. 실패 시 Approver가 코멘트 남기고 재시도

## 2. 테스트 케이스 (요약)
| ID | 시나리오 | 기대 결과 |
|---|---|---|
| WF-01 | 승인 요청 성공 | 상태 `대기` → `승인` 전환, 히스토리 기록 |
| WF-02 | 승인 반려 | 상태 `대기` → `반려`, 코멘트 저장 |
| WF-03 | Add-in 실패 재시도 | 배지 `실패` → 재시도 → `완료`
| WF-04 | 권한 제한 | Viewer는 승인 버튼 숨김 |
| WF-05 | 병행 사용 | 두 명이 동시에 승인 시 경고/락 |

## 3. 테스트 환경
- Stage API + Next.js Stage 빌드
- Test 계정: Viewer, Editor, Approver, Admin
- Mock Add-in Worker: 결과 시뮬레이션 API 제공

## 4. 검증 포인트
- UI 상태(배지, 버튼)와 API 응답이 일치하는지
- 히스토리 타임라인이 이벤트 순서대로 기록되는지
- SignalR 끊김 시 fallback(Toast + Polling) 동작 여부

## 5. TODO
- Mock Add-in API 일정 확정
- 병행 승인 Lock 전략(낙관적 vs 비관적) 확정
- QA 자동화: Playwright 시나리오 작성 계획
