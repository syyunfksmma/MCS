# Backend Contract Workshop Schedule (Option/Server/Esprit)
- 작성일: 2025-09-30 (Codex)
- 목적: Option/Server/Esprit 기능에 대한 API 계약을 Sprint 8~10 범위에 맞춰 확정하여 프론트엔드 리스크를 줄인다.

## 1. 일정 개요
| 회차 | 일시 (KST) | 주제 | 참석자 |
| --- | --- | --- | --- |
| 1차 | 2025-10-02 09:30-11:00 | 요구사항 정리 및 도메인 모델 확정 | Codex, 단독 개발자, 제조 CAM 리드, 시스템 관리자 |
| 2차 | 2025-10-04 14:00-16:00 | API 계약 초안 리뷰(Option/Server) & 보안 정책 | Codex, 단독 개발자, 보안 담당, DBA |
| 3차 | 2025-10-07 09:30-11:30 | Esprit EDGE 연동 & 이벤트 흐름 확정 | Codex, 단독 개발자, Esprit 담당, 운영팀 |
| 4차 | 2025-10-09 15:00-16:30 | 최종 통합 검토 & 승인 절차 | Codex, 단독 개발자, QA 리드, 프로젝트 오너 |

## 2. 회의 목표 & 산출물
- 공통: API 엔드포인트 목록, 스키마, 인증 권한 매트릭스, 사전/사후 조건 정리.
- Option: 폴더 구조 설정, 작업 할당 매핑, Access Data 소스 매핑, Esprit EDGE 버전 관리, 트래픽/서비스 토글의 계약 정의.
- Server: 로그/검색/REV 관리 API, STL/SolidWorks 미리보기 스트림 프로토콜, 상태 모니터링 이벤트.
- Esprit: API 키 발급/전달 절차, EDGE 프로세스 기동 및 상태 콜백, 실패 재시도 시나리오.
- 산출물: /docs/api/BackendContract_Option_Server_Esprit_v1.yaml, 회의록(docs/meetings/BackendContract_Workshop_Log.md), 위험/결정 목록.

## 3. 사전 준비 체크
- Codex: PRD_MCS.md, QA_250930.docx, Esprit API CSV 최신본 분석.
- 단독 개발자: 현재 구현 코드 스니펫, 로그 샘플, SignalR 허브 초안.
- CAM 리드/운영팀: 실제 폴더 구조 다이어그램, SLA 요구치, 보안 정책 문서.
- QA 리드: 검증 항목 초안(토글, 승인 흐름, 3D 뷰어).

## 4. 후속 액션 타임라인
- 2025-10-05: Option/Server API 초안 배포, 참석자 코멘트 수집.
- 2025-10-08: Esprit EDGE 시퀀스 다이어그램 확정, 실패 시나리오 보완.
- 2025-10-11: 모든 의견 반영한 계약 버전 v1.0 확정, Sprint 8~10 Task List 링크 업데이트.
- 2025-10-12: 보안/DBA 최종 승인, 개발 착수 Go/No-Go 결정.

## 5. 리스크 및 대응
- 시간 충돌: 각 회의 하루 전 캘린더 재확인, 불참 시 녹화 공유.
- 요구 변경: 변경 요청 발생 시 Sprint Task List에 취소선 기록 후 재조정.
- 외부 의존성: Esprit 라이선스/SDK 지연 시 Mock 서버 우선 구축.

## 6. 커뮤니케이션
- 회의록/결정 사항은 회의 종료 후 24시간 내 Teams → Docs 반영.
- 모든 API 변경은 Github Issue + PR Template 활용, 태그 ackend-contract 지정.
- Slack 채널 #mcs-backend-contract에서 Q/A 상시 처리.
