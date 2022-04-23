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
        // Test Case #1
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
        // Test Case #3
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
        // Test Case #2
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
        // Test Case #4
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

  // Test Case #5
  describe('Handling invalid latitude/longitude inputs', () => {
    let errorTextDiv;

    beforeEach(async () => {
      errorTextDiv = await driver.findElement(By.id('errorText'));
    });

    const fillCoordinates = async (latitude, longitude) => {
      await driver.findElement(By.id('latInput')).clear();
      await driver.findElement(By.id('lngInput')).clear();

      await driver.findElement(By.id('latInput')).sendKeys(latitude);
      await driver.findElement(By.id('lngInput')).sendKeys(longitude);
    }

    test('should give error if either latitude or longitude is empty', async () => {
      await fillCoordinates('', '');
      await driver.findElement(By.id('showCountry')).click();
      expect(await errorTextDiv.getText()).toBe('Latitude cannot be empty!');

      await fillCoordinates('Test', '');
      await driver.findElement(By.id('showCountry')).click();
      expect(await errorTextDiv.getText()).toBe('Longitude cannot be empty!');

      await fillCoordinates('', 'Test');
      await driver.findElement(By.id('showCountry')).click();
      expect(await errorTextDiv.getText()).toBe('Latitude cannot be empty!');
    });

    test('should give error if either latitude or longitude is not a number', async () => {
      await fillCoordinates('Test', 'Test');
      await driver.findElement(By.id('showCountry')).click();
      expect(await errorTextDiv.getText()).toBe('Latitude must be number!');
      
      await fillCoordinates('35.1212', 'Test');
      await driver.findElement(By.id('showCountry')).click();
      expect(await errorTextDiv.getText()).toBe('Longitude must be number!');

      await fillCoordinates('Test', '35.1212');
      await driver.findElement(By.id('showCountry')).click();
      expect(await errorTextDiv.getText()).toBe('Latitude must be number!');
    });

    test('should give error if either latitude or longitude is not in correct range', async () => {  // ([-90, 90] for latitude, [-180, 180] for longitude)
      await fillCoordinates('-100', '35.1212');
      await driver.findElement(By.id('showCountry')).click();
      expect(await errorTextDiv.getText()).toBe('Latitude must be in range (-90, 90)!');

      await fillCoordinates('35.1212', '-200');
      await driver.findElement(By.id('showCountry')).click();
      expect(await errorTextDiv.getText()).toBe('Longitude must be in range (-180, 180)!');
    });
  });

  // Test Case #6
  test('should give error if no country information found for specified location', async () => {
    // (0, 0) coordinates are not in any country
    await driver.findElement(By.id('latInput')).sendKeys('0');
    await driver.findElement(By.id('lngInput')).sendKeys('0');
    await driver.findElement(By.id('showCountry')).click();

    let error;
    await driver.wait(async () => {
      error = await driver.findElement(By.id('errorText')).getText();
      return !!error;
    }, 5000);

    expect(error).toBe('No country information found!');
  });
});