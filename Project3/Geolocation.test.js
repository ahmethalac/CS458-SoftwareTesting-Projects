import { Builder, By, Key } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { COORDINATE_MAPPINGS } from './constants';

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

    COORDINATE_MAPPINGS.forEach(({ coordinates, country: expectedCountry }, index) => {
      const { latitude, longitude } = coordinates;
      it(`should show '${expectedCountry}' for dummy location #${index}`, async () => {
        await driver.findElement(By.id('latInput')).sendKeys(latitude);
        await driver.findElement(By.id('lngInput')).sendKeys(longitude);

        const countryDiv = await driver.findElement(By.id('country'));
        let country = await countryDiv.getText();
        expect(country).toBe('');

        await driver.findElement(By.id('showCountry')).click();

        await driver.wait(async () => {
          country = await countryDiv.getText();
          return !!country;
        }, 5000);
        
        expect(country).toBe(expectedCountry);
      });
    })
  });

  describe('Showing distance to Geographic North Pole', () => {
    COORDINATE_MAPPINGS.forEach(({ coordinates, distance: expectedDistance }, index) => {
      const { latitude, longitude } = coordinates;
      it(`should calculate distance between Geographic North Pole and dummy location #${index}`, async () => {
        // Set geolocation of the device
        const pageCdpConnection = await driver.createCDPConnection('page');
        await pageCdpConnection.execute("Emulation.setGeolocationOverride", {
          latitude,
          longitude,
          accuracy: 100
        });
        
        const distanceDiv = await driver.findElement(By.id('northPole'));
        let distance = await distanceDiv.getText();
        expect(distance).toBe('');

        await driver.findElement(By.id('showNorthPoleDistance')).click();

        await driver.wait(async () => {
          distance = await distanceDiv.getText();
          return !!distance;
        }, 20000);
        
        expect(Math.abs(distance - expectedDistance)).toBeLessThanOrEqual(2);
      });
    });
  });

});