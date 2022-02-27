require('chromedriver');
var { Builder, By } = require('selenium-webdriver');

async function run() {
  const driver = await new Builder().forBrowser('chrome').build();

  await driver.get('file:///' + __dirname + '/index.html');

  const mailInput = await driver.findElement(By.id('mail'));
  const passwordInput = await driver.findElement(By.id('password'));
  const signButton = await driver.findElement(By.id('signInButton'));

  await mailInput.sendKeys('05553332222');
  await passwordInput.sendKeys('deniz');
  await signButton.click();

  try {
    await driver.findElement(By.className('success'));
    console.log('Successful login');
  } catch (error) {
    console.log('Fail login');
  }

  await driver.quit();
}

run();
