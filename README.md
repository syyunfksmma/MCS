# MCS: (Manufacturing Cam Managerment System)

## 프로젝트 개요

MCS(Manufacturing Cam Managerment System)는 제조 기업의 제품 데이터·공정(Routing) 관리, 협업 자동화, 품질·변경 이력 추적, SolidWorks/Esprit 등 CAD/CAM 연동을 지원하는 통합 플랫폼입니다.  
PLM(Product Lifecycle Management) 및 PDM(Product Data Management) 핵심 기능을 웹 기반으로 제공하며, 대시보드, 상세 탐색, 승인/반려 워크플로우, API/권한 관리 등 현업 요구에 맞춘 확장성을 갖추고 있습니다.

---

## 주요 기능

### 1. 제품/공정 데이터 관리
- ERP/PLM 품목(Item), Revision, Routing, 파일 이력 통합 관리
- Explorer(SSR) 페이지: 제품·Revision·Routing 계층 구조 탐색 및 대시보드
- Revision Workspace: Revision별 상세 정보, 변경 이력, SolidWorks/3DM 상태 배지 제공

### 2. 협업 및 승인 프로세스
- 업무 승인/반려·코멘트·이력 조회
- 작업 흐름 자동화(Drag & Drop 에디터, Add-in Control Panel)
- 감사 로그, 변경 이력 추적

### 3. CAD/CAM 연계
- SolidWorks, Esprit 등 설계/가공 데이터 실시간 연동
- 가공 경로 자동 생성(CNC/MCT, 다양한 feature 지원)
- 3D/2D 뷰어 및 도면/문서 관리

### 4. 시스템 & 보안 관리
- 관리자 콘솔: 사용자·역할·API Key·시스템 설정
- 감사 로그, Feature Flag, 환경변수 관리
- API Key 발급/폐기, 만료/Slack 알림, KMS/Secrets 연동

### 5. 테스트 및 품질보증(QA/UAT)
- 단위/통합/UI 자동화 테스트, 승인 흐름 E2E 테스트
- QA/UAT 피드백 관리, 회귀 테스트, 주니어 개발자 지침 제공

---

## 개발/운영 참고
- Next.js 기반 SSR, React Query 캐싱, SignalR 실시간 반영
- 모든 주요 변경은 영어 주석 및 로그로 추적
- 대용량 데이터 트리, 접근성, API Rate Limit 등 다양한 리스크 관리

---

## 문서 및 추가 정보

- [Phase5_Overview](docs/prd/Phase5_Overview.md): Explorer/Revision 기능
- [Phase6_Overview](docs/prd/Phase6_Overview.md): Routing Workspace/승인 플로우
- [Phase7_Overview](docs/prd/Phase7_Overview.md): Admin Console/감사로그 관리
- [Phase9_QA_UAT](docs/Phase9_QA_UAT.md): QA/UAT/테스트 전략
- [Sprint5_Routing_TaskList](docs/sprint/Sprint5_Routing_TaskList.md): 작업
