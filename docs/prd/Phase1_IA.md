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
# Phase 1 산출물 - 정보 구조(IA) & 내비게이션 개요

## 1. 상위 IA 구조
- **Dashboard**
  - 오늘의 알림
  - 대기 라우팅 요약
  - Add-in 큐 상태
- **Explorer**
  - Item / Revision / Routing 트리
  - 검색 & 필터 패널
- **Routing Workspace**
  - 단계 편집 탭
  - 파일 관리 탭
  - 승인 & 히스토리 탭
  - Add-in 연동 탭
- **Admin Console**
  - 사용자/역할 관리
  - API 키 & Add-in 파라미터
  - 시스템 설정(Feature Flag, 환경 변수)
- **Monitoring**
  - KPI 대시보드
  - 로그 & 알람
- **Help Center**
  - 튜토리얼, FAQ, 가이드 동영상

## 2. 내비게이션 패턴
- 상단 글로벌 바: 로고, 검색, 알림, 사용자 메뉴(설정, 로그아웃)
- 좌측 사이드바: 주요 영역(Dashboard, Explorer, Workspace, Admin, Monitoring, Help)
  - Explorer/Workspace는 접이식 섹션
  - 권한별로 메뉴 노출 제어
- Breadcrumb: Explorer/Workspace 내부에서 Item > Revision > Routing 경로 표시
- 탭 네비게이션: Routing Workspace 내 탭(Stages / Files / Approval / Add-in)
- Context Panel: 우측 슬라이드 패널(히스토리, 코멘트, Add-in 로그)

## 3. 페이지 상세 (요약)
| 페이지 | 주요 모듈 | 데이터 소스 |
|---|---|---|
| Dashboard | KPI 카드, 알림 리스트, Add-in 큐 요약 | `/api/dashboard`, `/api/addin/jobs` |
| Explorer | 트리 뷰, 속성 패널 | `/api/items`, `/api/routings` |
| Routing Workspace | 탭형 편집기, meta.json 뷰어 | `/api/routings/{id}`, `/api/routings/{id}/files` |
| Admin Console | 사용자/역할 그리드, API 키 관리 | `/api/admin/users`, `/api/addin/keys` |
| Monitoring | 그래프, 테이블, 필터 | `/api/metrics`, `/api/logs` |
| Help Center | 문서 카드, 검색, 튜토리얼 | Static/Markdown + `/api/help` |

## 4. 권한별 IA 접근
| 역할 | 접근 메뉴 |
|---|---|
| Viewer | Dashboard, Explorer, Routing Workspace(읽기), Help |
| Editor | Viewer + Routing Workspace 편집, 일부 Admin 읽기 |
| Approver | Editor + 승인 탭 액션, Monitoring 읽기 |
| Admin | 전 메뉴 접근, Admin Console 전체 기능 |

## 5. 모바일/소형 해상도 고려
- 1280px 미만: 사이드바 자동 축소, 하단 글로벌 바 제공
- 주요 KPI 카드 → 2열 그리드
- 트리 뷰: Accordion + 검색 우선

## 6. 향후 확장 포인트
- Explorer에서 ML 추천(미래 기능) 섹션 추가 공간 확보
- Monitoring에 Alert Rules 편집 모듈 추가 여지
- Help Center에 챗봇/FAQ 자동응답 연동 가능성

