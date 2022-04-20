var { Builder, By, Key } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');

const chromeOptions = new Options();
chromeOptions.excludeSwitches('enable-logging');

const loginPage = 'https://localhost:3000';
const driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();

const testCases = [
  async function case1() {

  },
  async function case2() {

  },
  async function case3() {
    
  },
  async function case3() {
    
  },
  async function case5() {
    
  }
];

async function run() {
  await new Promise(res => setTimeout(res, 500));
  console.log('---------------------------');
  console.log('Starting test cases');
  console.log('---------------------------');
  for (let i = 0; i < testCases.length; i++) {
    console.log(`TEST CASE ${i + 1}`)
    const testCase = testCases[i];
    await driver.get(loginPage);
    try {
      await testCase();
      console.log(`Successful`);
    } catch (error) {
      console.log(`Failed because of error: ${error}`)
    }
    console.log('---------------------------');
  }
  await driver.quit();
}

driver.then(run);
