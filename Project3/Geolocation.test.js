import { Builder, By, Key } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

describe('Geolocation Service Tests', () => {
  let driver;
  const loginPage = 'https://localhost:3000';

  beforeAll(() => {
    const chromeOptions = new Options();
    chromeOptions.excludeSwitches('enable-logging');

    driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
  });

  beforeEach(async () => {
    await driver.get(loginPage);
  });

  afterAll(async () => {
    await driver.quit();
  });
  
});