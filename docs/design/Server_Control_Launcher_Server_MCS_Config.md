# 절대 지령
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
