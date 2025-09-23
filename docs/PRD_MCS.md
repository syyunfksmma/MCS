# MCMS Web Portal PRD (Next.js)

## 절대 지령
1. 각 단계는 승인 후에만 진행한다.
2. 단계 착수 전 해당 단계 전체 범위를 리뷰하고 오류를 식별한다.
3. 오류 발견 시 수정 전에 승인 재요청한다.
4. 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
5. 모든 작업은 문서화하고 추적한다 (로그·다이어그램 포함).
6. Task List와 체크박스를 유지하며, Sprint Task에서도 절대 지령을 동일하게 적용한다.
7. 모든 작업 과정과 로그를 문서에 남긴다. 필요 시 다이어그램을 첨부한다.
8. PoC 단계는 1인 기업 기준으로 계획한다.
9. 모든 코드와 API 작성은 Codex가 수행한다.

> 절대 지령은 전체 프로젝트와 각 Sprint 작업에 동일하게 적용된다.

## 1. 프로젝트 개요 (한 줄 요약)
Next.js 기반 MCMS 웹 포털을 구축하여 CAM 데이터와 ESPRIT Add-in 연동을 브라우저에서 통합 관리한다.

## 2. 목표 & 성공 지표
| 구분 | 설명 |
|---|---|
| 데이터 중앙화 | W: 공유 드라이브 구조는 유지하되 메타데이터와 이력은 MCMS API로 관리 |
| Add-in 연동 | ESPRIT Add-in에 필요한 API 키/파라미터를 웹 포털에서 안전하게 전달 |
| 사용성 | 주니어 엔지니어도 직관적으로 사용할 수 있는 반응형 UI와 온보딩 제공 |
| 성능 | 동시 10명 이상 사용 시 주요 페이지 TTFB 500ms 이내 |
| 확장성 | 향후 ML 추천·모바일 알림 등으로 확장 가능한 모듈 구조 |
| 장애 복구 | 포털 장애 발생 시 30분 이내 서비스 복구 |

## 3. 사용자 페르소나
- **CAM Engineer**: 라우팅 조회/편집, 승인 요청, 파일 관리
- **Approver**: 승인/반려, Add-in 작업 상태 모니터링
- **Admin**: 사용자/권한, API 키, 시스템 설정 관리
- **ESPIRIT Add-in Operator**: 큐 상태 확인, Add-in 실행/재시도
- **IT Operator**: 배포/모니터링, SSO/보안 정책 유지

## 4. 시스템 아키텍처 (고수준)
```
[Next.js Web Portal]
    |  (REST API, SignalR/SSE)
    v
[MCMS API (.NET 8)]  ---  [SQL Server]
    |                         |
    | (Queue / REST)          | (파일 메타데이터, 이력)
    v                         v
[MCMS Workers (.NET)]     [W:\ 공유 드라이브]
    |
    | (HTTPS)
    v
[ESPRIT Edge Add-in (C#)]
```

- 프론트엔드: Next.js 14 + React 18 + TypeScript, Tailwind CSS, React Query
- 실시간: Next.js API Route에서 SignalR/SSE 게이트웨이 구성
- 인증: Azure AD SSO(msal-browser) → 백엔드 JWT
- 백엔드/데이터: 기존 .NET API, Workers, SQL Server 유지
- 배포: IIS Reverse Proxy + Node.js 20 LTS SSR 서버

## 5. 핵심 기능
| 영역 | 상세 설명 |
|---|---|
| Item/Routing Explorer | SSR 기반 트리 뷰, 서버 검색/필터, 즐겨찾기 |
| Routing Workspace | Drag & Drop 단계 편집, meta.json 미리보기, 파일 업/다운로드 |
| 승인/히스토리 | 타임라인, 다중 승인자, Add-in 배지, 코멘트 Threading |
| Add-in Control | 큐 상태 실시간 표시, 재시도/취소, API 키 갱신 |
| Admin Console | API 키, AD 롤 매핑, Feature Flag, 환경 변수 설정 |
| 모니터링 | KPI/알람 대시보드, 오류 이벤트 확인 |

### Docker 기반 배포 고려 사항
- Next.js 프런트엔드를 `node:20-alpine` 기반 멀티스테이지 Dockerfile로 빌드/배포한다. (build stage: `npm ci && npm run build`, runtime stage: `next start`).
- 컨테이너 런타임 환경 변수는 `.env.production` (예: `NEXT_PUBLIC_API_BASE_URL`) 파일 또는 Compose override 파일에서 관리한다.
- Docker Compose로 `web`(Next.js) + `reverse-proxy`(IIS/NGINX) 조합을 구성하고, CI 파이프라인에서 이미지 태깅/푸시 후 배포 파이프라인을 자동화한다.

## 6. UX & 디자인 가이드
- 반응형 레이아웃 (Desktop 기본, 1024px 이상 최적화, Tablet 대응)
- 디자인 토큰: Tailwind 기반 Primary #2F6FED, Secondary #22B8CF, Accent #FACC15
- 컴포넌트: Table 가상화, Badge 상태색(완료/실패/대기), Skeleton 로딩
- 온보딩: 단계별 툴팁, 빈 상태 설명, 튜토리얼 비디오 링크

## 7. 기능 범위 (Phase 구분)
1. Alignment & Governance
2. Requirements & IA
3. Architecture & Hosting
4. Design System & UI Kit
5. Sprint 1 – Explorer & History
6. Sprint 2 – Workspace & Workflow
7. Admin & Settings
8. Performance & Reliability
9. QA & UAT
10. Deployment & Operations
11. Documentation & Training

## 8. 비범위 (Out of Scope)
- 모바일 네이티브 앱(iOS/Android)
- GraphQL, gRPC 전환
- 3D 뷰어/AR 기능
- 퍼블릭 클라우드 CDN/글로벌 배포 (추후 검토)

## 9. 제약 및 위험
| 구분 | 설명 |
|---|---|
| 네트워크 | 사내망 제한으로 외부 NPM Registry 미러 필요 |
| 보안 | SSO, AD 그룹 매핑 정책 확정 지연 가능성 |
| 인프라 | Node 서비스 장애 복구 자동화 필수 |
| 파일 | 브라우저 대용량 업로드 제한 → 청크 업로드, 백엔드 중계 필요 |
| Change Mgmt | 기존 WPF 사용자 혼란 → 교육/온보딩 플랜 마련 |

## 10. 성공 지표
- 라우팅 승인 리드타임 30% 단축
- Add-in 자동 입력 성공률 95% 이상 유지
- 사용자 만족도(UAT 설문) 4.2+/5
- 파일 버전 오류 월 20% 감소

## 11. 승인 및 향후 조치
- 본 PRD와 Phase별 PRD, Task List에 대해 프로젝트 오너 승인 후 실행.
- 승인 이후 단계별 산출물(UX 산출물, 아키텍처 문서, 디자인 토큰 등)을 검토하고 체크리스트 업데이트.
