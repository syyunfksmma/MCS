
> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, docs/Tasks_ML_Routing.md  
> Remaining Tasks: 0

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

## 참고 문서
- Sprint1 API 계약: `docs/sprint/Sprint1_APIContract.md`
- OpenAPI 발췌: `docs/sprint/Sprint1_OpenAPIExcerpt.yaml`
## Playwright 설치 가이드 (프록시/사내망)
### A. 사내 루트 CA 신뢰 (권장)
1. Windows 인증서 관리자에서 사내 루트 CA를 BASE64/PEM 형식으로 내보내 `C:\corp\rootCA.pem` 등에 저장합니다.
2. Node 런타임과 npm이 해당 CA를 신뢰하도록 설정합니다.
   ```powershell
   setx NODE_EXTRA_CA_CERTS "C:\corp\rootCA.pem"
   npm config set cafile "C:\corp\rootCA.pem"
   npm config set strict-ssl true
   # (프록시 사용 시)
   npm config set proxy http://<proxy-host>:<port>
   npm config set https-proxy http://<proxy-host>:<port>
   ```
3. 새 터미널에서 `npx playwright install --with-deps` 또는 CI에서는 `npx playwright install`을 실행합니다.
4. `NODE_TLS_REJECT_UNAUTHORIZED=0` 사용은 금지(보안 정책 위반 가능).

### B. 오프라인/캐시 설치
1. 인터넷 가능 PC에서 `npx playwright install`을 실행하면 `%USERPROFILE%\AppData\Local\ms-playwright`에 브라우저가 내려받아집니다.
2. 해당 폴더를 사내 파일 서버 등을 통해 대상 PC의 동일 경로에 복사하면 추가 설치 없이 사용 가능합니다.
3. 프로젝트 내부 캐시를 쓰려면 다음과 같이 설정합니다.
   ```powershell
   setx PLAYWRIGHT_BROWSERS_PATH "0"
   npx playwright install
   ```
   이렇게 하면 `node_modules/.cache/ms-playwright` 아래에 브라우저가 위치해 버전 관리와 캐시 정책을 맞출 수 있습니다.

### C. 장기 전략 (사내 미러)
- `ms-playwright` 캐시를 사내 아티팩트 서버에 보관하고, 개발 PC에서 해당 경로를 동기화하는 스크립트를 표준화하면 설치 속도와 재현성을 높일 수 있습니다.

### 빠른 점검 커맨드
```powershell
node -p "process.env.NODE_EXTRA_CA_CERTS"   # 추가 CA 경로 확인
npm config get cafile                        # npm이 참조하는 CA
npx playwright --version                      # Playwright 버전
npx playwright doctor                         # 진단
npx playwright install --dry-run              # 설치 시도만 수행
```

### 참고
- 세부 정책: `docs/playwright/CorporatePlaywrightPolicy.md` 참조.
- CI에서는 `PLAYWRIGHT_BROWSERS_PATH=0`와 `actions/cache`를 활용하면 브라우저를 재사용할 수 있습니다.
- 브라우저 설치가 불가할 경우 Selenium + Edge WebDriver 등의 대체 스모크 테스트를 병행해 최소 회귀를 확인하세요.

## E2E 테스트
- `npm run test:e2e` : Playwright 테스트 (실행 시 자동으로 production build + server 기동)
- 개별 시나리오는 `npx playwright test <spec>` 로 실행 가능. 서버를 별도 기동할 필요는 없으나 사전에 `npm run build`가 병행됨.

## Selenium 스모크 테스트
- `npm run test:selenium` : Edge WebDriver 기반 사내망 대응 스모크.
  - 사전 조건: `msedgedriver.exe`가 PATH에 존재하거나 `SELENIUM_MSEDGEDRIVER_PATH` 환경변수로 경로 지정.
  - 기본 대상 URL은 `http://localhost:3000/admin`; 변경하려면 `E2E_BASE_URL` 환경변수를 지정합니다.

## 수동 배포 참고
- 내부 배포 절차: `docs/ops/InternalManualDeployment.md`에서 단계별 체크리스트 확인.

## Azure AD Single Sign-On 설정

- `.env.production` 또는 `.env.local`에 다음 변수를 설정합니다.
  - `NEXT_PUBLIC_AZURE_AD_CLIENT_ID`, `NEXT_PUBLIC_AZURE_AD_TENANT_ID`, `NEXT_PUBLIC_AZURE_AD_REDIRECT_URI`, `NEXT_PUBLIC_AZURE_AD_SCOPES`
  - `NEXT_PUBLIC_MCMS_ALLOWED_ROLES` 값에 접근 허용 역할(예: `MCMS.Approver,MCMS.Admin`)을 쉼표로 구분해 입력합니다.
- 프런트엔드는 MSAL을 사용하여 로그인/로그아웃을 처리하며, 필수 역할이 없는 계정은 접근이 차단됩니다.
- 로컬 개발 중 AD 구성이 비어 있으면 기존 이메일 기반 모의 인증이 유지되며, 로그에 경고가 출력됩니다.
- 역할 매핑과 그룹 정책은 `docs/frontend/ComponentLibrary_Selection.md` 및 `docs/security/AzureAD_SSO.md`(추가 예정)에 기록해 운영팀과 공유하세요.
