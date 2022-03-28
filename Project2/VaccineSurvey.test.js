import { jest } from "@jest/globals";
import { remote } from "webdriverio";

// eslint-disable-next-line no-undef
jest.setTimeout(60000);
let driver;

describe('Vaccine Survey tests', () => {
  beforeAll(async () => {
    driver = await remote({
      path: "/wd/hub",
      host: "localhost",
      port: 4723,
      capabilities: {
        platformName: "android",
        platformVersion: "11", // must correct the stimuator
        deviceName: "Android Emulator", // must correct the stimuator
        appium: { connectHardwareKeyboard: true }
      },
      logLevel: 'silent'
    });
  });
  
  afterAll(async () => {
    if (driver) {
      await driver.deleteSession();
    }
  });
  
  test("Case 1", async () => {
    const nameInput = await driver.$("~nameInput");
    await nameInput.setValue('John');
    
    const surnameInput = await driver.$("~surnameInput");
    await surnameInput.setValue('Doe');

    const birthDateText = await driver.$("~birthDateText");
    await birthDateText.click();
  
    await driver.pause(3000);
  });
});
