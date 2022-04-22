import { Builder, By, Key } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { COORDINATE_MAPPINGS } from './constants';

jest.setTimeout(30000);

describe('Geolocation Service Tests', () => {
  let driver;
  const loginPage = 'https://localhost:3001';

  const setCurrentLocation = async (latitude, longitude) => {
    // Set geolocation of the device
    const pageCdpConnection = await driver.createCDPConnection('page');
    await pageCdpConnection.execute("Emulation.setGeolocationOverride", {
      latitude,
      longitude,
      accuracy: 100
    });
  }

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
      test(`for specified location (${expectedCountry})`, async () => {
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

      test(`for current location (${expectedCountry})`, async () => {
        await setCurrentLocation(latitude, longitude);

        const countryDiv = await driver.findElement(By.id('country'));
        let country = await countryDiv.getText();
        expect(country).toBe('');

        await driver.findElement(By.id('showCountry-autoGPS')).click();

        await driver.wait(async () => {
          country = await countryDiv.getText();
          return !!country;
        }, 5000);
        
        expect(country).toBe(expectedCountry);
      });
    })
  });

  describe('Showing distance to Geographic North Pole', () => {
    COORDINATE_MAPPINGS.forEach(({ coordinates, distance: expectedDistance, country }, index) => {
      const { latitude, longitude } = coordinates;
      test(`from current location (${country})`, async () => {
        await setCurrentLocation(latitude, longitude);
        
        const distanceDiv = await driver.findElement(By.id('northPole'));
        let distance = await distanceDiv.getText();
        expect(distance).toBe('');

        await driver.findElement(By.id('showNorthPoleDistance-autoGPS')).click();

        await driver.wait(async () => {
          distance = await distanceDiv.getText();
          return !!distance;
        }, 20000);
        
        expect(Math.abs(distance - expectedDistance)).toBeLessThanOrEqual(2);
      });

      test(`from specified location (${country})`, async () => {
        await driver.findElement(By.id('latInput')).sendKeys(latitude);
        await driver.findElement(By.id('lngInput')).sendKeys(longitude);
        
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