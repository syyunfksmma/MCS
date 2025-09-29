# MCMS Web Portal PRD (Next.js)

## Executive Summary
- 전사 MCMS 포털을 Next.js 14 기반 SSR/ISR 웹 앱으로 재구축한다.
- 기존 .NET 백엔드(API, Workers, CmdHost)와 데이터 모델은 유지하며, 프론트엔드와 호스팅 구조만 재설계한다.
- ESPRIT Edge Add-in, SolidWorks 자동화, W: 드라이브 파일 관리 등 핵심 통합 플로우를 웹 환경에서도 동일하게 제공한다.

## Goals & Narrative
1. CAM 운영자는 브라우저에서 Item/Revision/Routing을 조회·편집하고 ESPRIT Add-in 실행을 트리거할 수 있다.
2. Approver는 승인 요청, 승인/반려 처리, Add-in 작업 결과 모니터링을 Web UI에서 수행한다.
3. Admin은 API 키, 사용자/권한, 시스템 설정을 웹 포털에서 관리한다.
4. 시스템은 2025년 12월 시범 운영을 목표로 하며, 사내 AD SSO를 통한 인증을 지원한다.

## Scope
- **프론트엔드**: Next.js 14, React 18, TypeScript, Tailwind CSS, Ant Design 컴포넌트 최소화(Mantine/Headless UI 병행 검토).
- **상태 관리**: React Query + Zustand 조합으로 서버 캐싱과 전역 상태 분리.
- **API 연동**: 기존 REST 엔드포인트 유지(/api/items, /api/addin/jobs, /api/history/...). GraphQL 도입은 제외.
- **실시간**: SignalR 리스너를 Next.js API Route에서 구현, 클라이언트는 SSE 혹은 WebSocket으로 Add-in 상태를 수신.
- **인증/인가**: Azure AD SSO(사내 테넌트) + msal-browser, 백엔드는 기존 JWT 미들웨어 유지.
- **배포**: IIS Reverse Proxy + Node.js 20 LTS SSR 서버. 차후 Static Export는 고려 대상에서 제외.

## Success Metrics
| 지표 | 목표 |
| --- | --- |
| 주요 페이지 TTFB | 500ms 이내 (국내 사내망 기준) |
| Add-in 작업 배지 갱신 시간 | 2초 이내 |
| 사용자 만족도 | UAT 설문 4.2+/5 |
| 장애 복구 | 웹 포털 장애 발생 시 30분 이내 재기동 |

## User Roles
- CAM Engineer, Reviewer, Approver, Admin, IT Operator (기존과 동일).
- Add-in Operator는 웹 포털에서 작업 큐/배지 확인 후 ESPRIT Edge Add-in을 실행.

## Key Features
1. **Item & Routing Explorer**: SSR 기반 계층 트리, 서버 필터/검색, Column Virtualization.
2. **Routing Workspace**: Drag & Drop 단계 재배치, meta.json 미리보기, 파일 업로드 Progress Bar.
3. **Approval & History**: 타임라인, Add-in 작업 배지, 다중 승인자 지원, 코멘트 Threading.
4. **Add-in Control Panel**: 실시간 큐 상태, 최근 결과 로그, 수동 재시도/취소 기능.
5. **Admin Console**: API 키 관리, AD 롤 매핑, 시스템 구성 파라미터 수정.

## Non-Goals
- 모빌리티 앱(iOS/Android) 제공
- GraphQL, gRPC 전환
- 3D 뷰어/시각화 도입
- On-prem Node Cluster 외의 Cloud CDN 적용 (추후 검토)

## Constraints & Risks
- 사내망 인터넷 제한으로 외부 NPM Registry 미러 필요.
- W: 네트워크 드라이브 접근 권한은 백엔드 서비스 계정에 한정 (웹은 API 경유).
- SSR 서버 장애 시 CSR 폴백을 위한 별도 전략 필요.
- SSO 도입에 따른 AD 그룹 매핑 정책 확정이 필수.

## Open Issues
- IIS Reverse Proxy vs. Node Windows Service 중 선택 확정 필요.
- SignalR WebSocket 게이트웨이 TLS Termination 위치 결정.
- Add-in 결과 푸시 시 Auth 헤더 전략(서비스 계정 vs. Client Credential) 정의.

