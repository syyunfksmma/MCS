import { test, expect } from '@playwright/test';

// TODO: 서버 실행 후에 동작하도록 CI에서 dev server/preview를 기동해야 함.
test('Explorer page renders', async ({ page }) => {
  test.skip(true, '서버 기동 후 활성화 예정');
  await page.goto('/explorer');
  await expect(page.getByRole('heading', { name: 'Explorer Summary' })).toBeVisible();
});
