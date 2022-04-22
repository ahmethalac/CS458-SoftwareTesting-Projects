import { Builder, By, Key } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { COORDINATE_COUNTRY_MAPPINGS } from './constants';

jest.setTimeout(30000);

describe('Geolocation Service Tests', () => {
  let driver;
  const loginPage = 'https://localhost:3001';

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
  
  describe('Showing country according to coordinates', () => {

    COORDINATE_COUNTRY_MAPPINGS.forEach(({ coordinates, country }) => {
      const { latitude, longitude } = coordinates;
      it(`should show '${country}' for location: ${latitude},${longitude}`, async () => {
        await driver.findElement(By.id('latInput')).sendKeys(latitude);
        await driver.findElement(By.id('lngInput')).sendKeys(longitude);
        await driver.findElement(By.id('submitButton')).click();

        const countryDiv = await driver.findElement(By.id('country'));
        let countryText = await countryDiv.getText();
        expect(countryText).toBe('');

        await driver.wait(async () => {
          countryText = await countryDiv.getText();
          return !!countryText;
        }, 5000);
        
        expect(countryText).toBe(country);
      });
    })
  });

});