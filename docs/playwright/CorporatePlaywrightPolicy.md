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

> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, ~~docs/Tasks_ML_Routing.md~~ (폐기 2025-09-30)  
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
# Playwright 설치/배포 정책 (사내망)

## 1. 루트 CA 배포
- 정보보안팀은 사내 루트 CA 인증서를 `\\fileserver\certs\rootCA.pem` 경로로 제공한다.
- 개발자는 해당 PEM을 다운로드해 `C:\corp\rootCA.pem`에 저장하고 아래 스크립트를 실행한다.

```powershell
# PowerShell Profile (1회)
setx NODE_EXTRA_CA_CERTS "C:\corp\rootCA.pem"
npm config set cafile "C:\corp\rootCA.pem"
npm config set strict-ssl true
```

프록시 사용자는 추가로 다음을 설정한다.
```powershell
npm config set proxy http://proxy.example.local:8080
npm config set https-proxy http://proxy.example.local:8080
```

## 2. 브라우저 설치 자동화 스크립트
`scripts/playwright/install-with-ca.ps1`
```powershell
param(
  [string]$Destination = "$PSScriptRoot\..\node_modules\.cache\ms-playwright"
)

$ErrorActionPreference = 'Stop'
$env:PLAYWRIGHT_BROWSERS_PATH = '0'
$cachePath = Resolve-Path $Destination
Write-Host "Installing Playwright browsers to $cachePath"
Push-Location "$PSScriptRoot\..\web\mcs-portal"
try {
  npm install --no-audit --prefer-offline
  npx playwright install --with-deps
}
finally {
  Pop-Location
}
```
- 개발자는 `pwsh scripts/playwright/install-with-ca.ps1`로 브라우저와 캐시를 통일한다.
- 캐시 폴더(`node_modules/.cache/ms-playwright`)는 `actions/cache` 정책과 동일한 경로다.

## 3. 오프라인 캐시 배포
- 외부 인터넷이 되는 빌드 머신에서 `npx playwright install --with-deps`를 실행하고 `%USERPROFILE%\AppData\Local\ms-playwright` 폴더를 압축한다.
- 압축본을 사내 공유 위치 `\\fileserver\playwright-cache\<version>.zip`에 업로드한다.
- 개발자는 압축을 풀어 동일 경로에 덮어쓴 뒤 `npx playwright --version`으로 정상 설치 여부를 확인한다.

## 4. 문제 해결
| 증상 | 조치 |
|------|------|
| `SELF_SIGNED_CERT_IN_CHAIN` | 루트 CA 설정이 빠졌는지 확인 (`node -p "process.env.NODE_EXTRA_CA_CERTS"`). |
| `msedgedriver` 미설치 | https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/ 에서 버전 일치 드라이버 다운로드, PATH 등록. |
| `playwright install` 타임아웃 | 오프라인 캐시 복사 후 `npx playwright install --dry-run`으로 검증. |

