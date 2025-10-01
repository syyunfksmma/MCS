# Playwright Offline Setup Instructions

## 1. Browser Bundle Location
- 내부 저장소 또는 로컬 공유 폴더에 Playwright 브라우저 압축 파일을 위치시킵니다.
- 경로 예시: \\fileserver\\devtools\\playwright-browsers\\chromium-1187.

## 2. 환경 변수 설정
`powershell
 = "C:\\DevTools\\playwright-browsers"
`
- CI에서도 동일한 환경 변수를 설정해야 합니다.
- Playwright는 해당 경로 아래에 chromium, irefox, webkit 폴더를 찾습니다.

## 3. 설치 스크립트 실행
`powershell
npm run playwright:install-offline
`
- 이 스크립트는 PLAYWRIGHT_BROWSERS_PATH가 가리키는 위치에서 브라우저를 사용하도록 설정합니다.
- 경로에 브라우저가 없으면 기존 Playwright 명령을 그대로 호출하므로, 미리 압축을 풀어 두어야 합니다.

## 4. 사내 미러에서 가져오기
- 사내 Nexus/Artifactory에 미러를 구성한 경우, .npmrc 또는 환경 변수 PLAYWRIGHT_DOWNLOAD_HOST를 설정하여 해당 미러를 우선 사용하게 할 수 있습니다.
- 예시: set PLAYWRIGHT_DOWNLOAD_HOST=https://playwright-mirror.internal.example.com.

## 5. 문제 해결
- SSL 차단 오류 발생 시 IT 보안팀에 해당 호스트 인증서를 추가 요청합니다.
- 강제로 외부 다운로드를 막는 환경에서는 반드시 오프라인 번들을 사전에 배포해야 합니다.
