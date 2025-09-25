import { test } from '@playwright/test';

test.describe('Workspace 승인/반려 플로우 (Mock)', () => {
  test.skip(true, 'CI 환경에서 Next.js 앱이 실행되지 않아 Mock 시나리오만 정의');

  test('Routing 선택 후 승인 모달 작성', async ({ page }) => {
    await page.goto('http://localhost:3000/explorer');
    // TODO: Sprint 3 이후 실제 데이터/서버 연동 시 구현
  });

  test('Add-in 작업 완료 이벤트가 타임라인에 반영되는지 확인', async ({ page }) => {
    await page.goto('http://localhost:3000/explorer');
    // TODO: SignalR 실제 허브 연결 후 구현
  });
});