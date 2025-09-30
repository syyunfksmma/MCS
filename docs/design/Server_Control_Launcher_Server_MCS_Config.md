# Server Management & MCS Frontend Configuration Report

## 런처 서버 구성
- **프로세스 관리**: API-A/B(.NET)와 Web UI(React)를 PowerShell 스크립트로 제어
- **헬스 체크**: Node 기반 스텁(`scripts/server-control/mock-health-server.js`)으로 `/health/:service` 응답 제공, 추후 실제 엔드포인트 연결 예정
- **로그 전략**: 각 서비스 stdout/stderr를 `.\logs\` 폴더에 텍스트로 저장하고 UI에서 tail 스트리밍
- **권한 정책**: 관리자 권한 실행 권장, Elevation 필요 시 메시지 `L003`으로 UI 알림

## 환경 설정(appsettings.local.json)
```json
{
  "services": {
    "apiA": { "port": 7101, "health": "http://localhost:7800/health/apiA" },
    "apiB": { "port": 7102, "health": "http://localhost:7800/health/apiB" },
    "web":  { "port": 7300, "health": "http://localhost:7800/health/web" }
  },
  "logging": {
    "path": ".\\logs",
    "maxFileSizeMB": 10
  },
  "launcher": {
    "defaultUrl": "http://localhost:3000",
    "allowCustomUrl": true
  }
}
```

## MCS 프론트엔드 구성
- **기본 UI 요소**: Ribbon, KPI 카드, 상태 배지 등 Explorer 재구성 자산 재사용
- **상태 관리**: Redux Toolkit 기반 상태 트리(`services`, `logs`, `settings`)
- **통신 계층**: Fetch API → 런처 백엔드(`/launcher/*`) 호출, 에러 코드는 S98 통합 계획서의 `L001~L003` 활용
- **테마/토큰**: `styles/tokens.ts`에서 Teamcenter 색상·타이포를 가져와 공통화
- **모듈 구조**
  - `components/ServiceCard.tsx`: 상태 배지, 로그 링크, Start/Stop 버튼
  - `components/ActionsBar.tsx`: Start All/Stop All, Refresh 버튼
  - `components/ActivityLog.tsx`: 로그 스트림, 필터
  - `components/SettingsPanel.tsx`: URL 관리, 스크립트 경로 설정

## 배포/운영 고려
- PowerShell 스크립트와 UI 빌드를 함께 패키징(EXE 또는 MSIX)하여 설치 간소화
- Docker 옵션은 내부 QA용으로 준비하고, Windows 데스크톱 프로덕션은 EXE/MSIX 우선
- Timeline/Sprint Task와 연동해 실행/테스트 결과를 추적
