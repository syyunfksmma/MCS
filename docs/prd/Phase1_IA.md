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
