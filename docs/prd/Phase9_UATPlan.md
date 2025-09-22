# Phase 9 산출물 - UAT 계획

## 1. UAT 대상
| 역할 | 인원 | 주요 확인 항목 |
|---|---|---|
| CAM Engineer (주니어) | 3명 | Explorer/Workspace 사용성, 도움말 |
| Approver | 2명 | 승인 플로우, Add-in 결과 모니터링 |
| Admin (IT) | 2명 | 사용자/권한, API 키 관리 |
| Add-in Operator | 2명 | 큐 상태, 재시도 흐름 |

## 2. 일정
- 준비 회의: 2026-02-10
- UAT 세션 1 (CAM/Approver): 2026-02-12
- UAT 세션 2 (Admin/Add-in): 2026-02-14
- 피드백 정리 & 우선순위 지정: 2026-02-17
- 개선 반영/재테스트: 2026-02-19

## 3. 시나리오 패키지
- 각 역할별 스크립트(단계별 행동, 기대 결과)
- 체크리스트: 성공/실패 + 코멘트 입력
- 문제 보고: UAT Jira 프로젝트, 타입 “UAT Feedback”

## 4. 피드백 처리
1. UAT 전용 Teams 채널에 즉시 공유
2. Jira 티켓 생성 → Product Owner 우선순위 지정
3. Hotfix 필요 시 Sprint 버퍼 활용, 나머지 Phase 10 backlog 이동
4. 완료 티켓은 UAT 참가자 확인 후 Close

## 5. 준비물
- Stage 환경 데이터 리셋
- UAT 계정(MFA 설정 포함)
- UAT 가이드 문서/비디오(짧은 튜토리얼)

## 6. TODO
- UAT 설문(만족도) 양식 준비
- 세션 녹화/기록 방식 확정
- UAT 회의실 예약 및 장비 체크
