# UI Screenshot Capture Playbook

## 1. Prerequisites
- Storybook 정적 빌드(
pm run build-storybook)가 최신 상태여야 합니다.
- Playwright 브라우저가 오프라인 번들 또는 사내 미러를 통해 설치되어 있어야 합니다.
- PLAYWRIGHT_BROWSERS_PATH 또는 PLAYWRIGHT_DOWNLOAD_HOST를 활용한 네트워크 차단 우회가 선행돼야 합니다.

## 2. 캡처 스크립트 실행
`powershell
# Storybook 정적 파일 기준 캡처
npx playwright test tests/e2e/screenshots --project=chromium
`
- 	ests/e2e/screenshots 폴더에 스크린샷 전용 스펙을 배치합니다.
- Storybook을 대상으로 캡처할 경우 playwright test --config=playwright.storybook.config.ts 형태로 분리할 수 있습니다.

## 3. 산출물 정리
- 스크린샷은 rtifacts/ui-snapshots/YYYYMMDD/ 아래에 보관합니다.
- 보고서(eports/PoC_Final_Execution_Report.md)에는 캡처 경로와 생성 일자를 표로 기록합니다.

## 4. 실패 시 대안
1. 최신 스크린샷이 필요하지만 브라우저 설치가 불가능한 경우, 기존 rtifacts/ui-snapshots/latest 폴더를 재활용하고 변경 포인트는 텍스트/애니메이션 설명으로 대체합니다.
2. Storybook에서 
pm run storybook을 띄운 뒤 내부 캡처 도구(브라우저 개발자 도구의 스크린샷 기능)를 수동으로 사용해도 됩니다. 캡처 경로와 사용한 브라우저를 기록하십시오.

## 5. 백업/버전 관리
- 모든 최종 스크린샷은 Git LFS 또는 사내 파일서버에 업로드하여 용량 문제를 피합니다.
- 보고서에는 캡처한 커밋 SHA와 Storybook 빌드 로그 링크를 함께 남겨 재현성을 확보합니다.
