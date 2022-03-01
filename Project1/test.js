require('chromedriver');
var { Builder, By } = require('selenium-webdriver');

const driver = new Builder().forBrowser('chrome').build();

const testCases = [
  async function case1() {
    // WORK IN PROGRESS
    const mailInput = await driver.findElement(By.id('mail'));
    const passwordInput = await driver.findElement(By.id('password'));
    const signButton = await driver.findElement(By.id('signInButton'));

    await mailInput.sendKeys('05553332222');
    await passwordInput.sendKeys('de');
    await signButton.click();
    await driver.sleep(500);
    try {
      await driver.findElement(By.className('success'));
    } catch (error) {
      throw new Error('Fail Login' + error);
    }
  },
  async function case2() {
    const mailInput = await driver.findElement(By.id('mail'));
    const passwordInput = await driver.findElement(By.id('password'));
    const signButton = await driver.findElement(By.id('signInButton'));
    await mailInput.sendKeys('denizcalkan@hotmail.com'); //correct mail
    await passwordInput.sendKeys('munevver'); //wrong password for given mail
    await signButton.click();
    await driver.sleep(500);
    try {
      await driver.findElement(By.className('success'));
    } catch (error) {
      throw new Error('Fail Login' + error);
    }
    throw new Error('Not implemented');
  },

  async function case3() {
    // TODO
    throw new Error('Not implemented');
  },
  async function case4() {
    // TODO
    throw new Error('Not implemented');
  },
  async function case5() {
    // TODO
    throw new Error('Not implemented');
  }
];

async function run() {
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    await driver.get('http://localhost:3000');
    try {
      await testCase();
      console.log(`Test case ${i + 1} is successful`);
    } catch (error) {
      console.log(`Test case ${i + 1} is failed because of error: ${error}`)
    }
  }
  await driver.quit();
}

driver.then(run);
