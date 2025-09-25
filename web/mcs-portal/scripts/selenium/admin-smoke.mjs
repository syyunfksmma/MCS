import { Builder, By, until } from 'selenium-webdriver';
import edge from 'selenium-webdriver/edge.js';

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000/admin';

async function run() {
  let driver;
  try {
    const options = new edge.Options();
    options.setEdgeChromium(true);
    options.addArguments('--headless=new');
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');

    driver = await new Builder()
      .forBrowser('MicrosoftEdge')
      .setEdgeOptions(options)
      .build();

    await driver.get(BASE_URL);
    await driver.wait(until.elementLocated(By.css('h1, h2, [role="heading"]')), 10000);

    const heading = await driver.findElement(By.css('h1, h2, [role="heading"]')).getText();
    console.log(`Found heading: ${heading}`);
  } catch (error) {
    console.error('Selenium smoke test failed:', error);
    process.exitCode = 1;
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

run();
