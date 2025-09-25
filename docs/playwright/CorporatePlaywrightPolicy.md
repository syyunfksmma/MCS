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
