import { expect, test } from '@playwright/test';

const ADMIN_URL = process.env.PLAYWRIGHT_ADMIN_URL ?? 'http://localhost:3000/admin';
const SHOULD_SKIP = process.env.PLAYWRIGHT_E2E !== 'true';

test.describe('Admin Console (Mock)', () => {
  test.skip(SHOULD_SKIP, 'Next.js 테스트 환경이 준비되지 않았습니다. 준비되면 PLAYWRIGHT_E2E=true 로 실행하세요.');

  test('감사 대시보드와 로그 패널이 표시된다', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await expect(page.getByRole('heading', { name: '감사 통계 & 메시지 센터' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '감사 로그' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '모니터링 대시보드' })).toBeVisible();
  });

  test('CSV 내보내기 동작을 수행한다', async ({ page }) => {
    await page.goto(ADMIN_URL);
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'CSV 내보내기' }).click()
    ]);
    const filename = await download.suggestedFilename();
    expect(filename).toContain('audit-logs');
  });
});
