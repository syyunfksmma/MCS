# MCS Portal (Next.js)

이 프로젝트는 Manufacturing CAM Management System의 웹 포털 프런트엔드입니다. Next.js(App Router) + TypeScript + Ant Design을 사용합니다.

## 절대 조건
- 각 단계는 승인 후 진행
- 변경 사항은 반드시 문서로 기록
- Task 체크박스 갱신

## 개발 환경 준비
```bash
cd web/mcs-portal
npm install
npm run dev
```

## 주요 스크립트
- `npm run dev` : 개발 서버 (http://localhost:3000)
- `npm run build` : 프로덕션 빌드
- `npm run start` : 빌드 결과 실행
- `npm run lint` : ESLint 검사
- `npm run format` : Prettier 포맷팅

## VS Code 추천 확장
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Ant Design Snippets (선택)

## 구조
```
src/
 ├─ app/
 │   ├─ layout.tsx        # 전역 레이아웃, 반응형 컨테이너
 │   ├─ page.tsx          # Explorer 기본 페이지
 │   └─ globals.css       # Tailwind + 글로벌 스타일
 ├─ components/
 │   ├─ HeaderBar.tsx     # 상단 헤더
 │   ├─ MainLayout.tsx    # 공통 레이아웃 및 사이드바
 │   └─ TreePanel.tsx     # 품목/Revision/라우팅 트리
 └─ theme/
     └─ colors.ts         # 파스텔 톤 컬러 정의
```

## 앞으로의 작업
- API 연동 및 React Query 설정
- 인증/권한 흐름 구현
- 생산 관리자용 대시보드 추가

## CI
- GitHub Actions: `.github/workflows/ci.yml`
- 작업: npm install → lint → prettier 체크 → build

## 참고 문서
- Sprint1 API 계약: `docs/sprint/Sprint1_APIContract.md`
- OpenAPI 발췌: `docs/sprint/Sprint1_OpenAPIExcerpt.yaml`
## Playwright 내부망 실행 가이드
1. 사내 표준 브라우저(Edge 또는 Chrome)가 설치되어 있어야 합니다. 기본 채널은 `msedge`입니다. 다른 브라우저를 쓰려면 `PLAYWRIGHT_CHANNEL` 환경 변수를 설정하세요.
2. 브라우저 다운로드를 건너뛰기 위해 테스트 실행 전에 아래와 같이 환경 변수를 지정합니다.
   - PowerShell 예시:
     ```powershell
     $env:PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = '1'
     $env:PLAYWRIGHT_CHANNEL = 'msedge'   # 선택 사항
     npm run test:e2e
     ```
   - 명령 프롬프트 예시:
     ```cmd
     set PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
     set PLAYWRIGHT_CHANNEL=msedge
     npm run test:e2e
     ```
3. CI 혹은 자동화 환경에서도 동일하게 `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`을 세팅하면 외부 네트워크 없이 실행할 수 있습니다.

## E2E 테스트
- `npm run test:e2e` : Playwright 테스트 (실행 시 자동으로 production build + server 기동)
- 개별 시나리오는 `npx playwright test <spec>` 로 실행 가능. 서버를 별도 기동할 필요는 없으나 사전에 `npm run build`가 병행됨.

## Docker 배포
- `Dockerfile` : node:20-alpine 기반 멀티스테이지 이미지(빌드/런타임 분리).
- `docker-compose.yml` : `web`(Next.js) + `reverse-proxy`(Nginx) 서비스 예시.
- 실행 예시
```bash
docker compose up --build
```
- 환경 변수는 `.env.production` 또는 compose 환경 섹션에서 주입할 수 있습니다.

