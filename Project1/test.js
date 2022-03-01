var { Builder, By, Key } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');

const chromeOptions = new Options();
chromeOptions.excludeSwitches('enable-logging');

const loginPage = 'https://localhost:443';
const driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();

const tryLogin = async (mail, password) => {
  const mailInput = await driver.findElement(By.id('mail'));
  const passwordInput = await driver.findElement(By.id('password'));
  const signButton = await driver.findElement(By.id('signInButton'));

  await mailInput.sendKeys(mail);
  await passwordInput.sendKeys(password);
  await signButton.click();
  await driver.sleep(500);
};

const checkSuccessPage = async (expectVisible = true) => {
  const url = await driver.getCurrentUrl();
  const isSuccessPage = url.indexOf('success.html') > -1;
  if (isSuccessPage === !expectVisible) throw new Error(`Success page is${expectVisible ? ' not' : ''} opened!`);
}

const loginWithFacebook = async (mail, password) => {
  const facebookButton = await driver.findElement(By.id('facebook_login'));
  await facebookButton.click();

  await driver.wait(
    async () => (await driver.getAllWindowHandles()).length === 2,
    10000
  );
  const [originalWindow, facebookPopup] = await driver.getAllWindowHandles();

  await driver.switchTo().window(facebookPopup);
  const emailInput = await driver.findElement(By.id('email'));
  await emailInput.clear();
  await emailInput.sendKeys(mail);
  const passInput = await driver.findElement(By.id('pass'));
  await passInput.sendKeys(password);

  const loginButton = await driver.findElement(By.name('login'));
  await loginButton.click();

  await driver.wait(
    async () => (await driver.getAllWindowHandles()).length === 1,
    10000
  );

  await driver.switchTo().window(originalWindow);
}
const testCases = [
  async function case1() {
    // Invalid mail
    const mailInput = await driver.findElement(By.id('mail'));
    await mailInput.sendKeys('ahmet');
    await driver.executeScript("document.querySelector('#mail').blur()");
    let warningEmail = await driver.findElement(By.id('warningEmail'));
    if (!warningEmail.isDisplayed()) throw new Error('Invalid mail does not give error');
    console.log('PASSED: Invalid mail gives error');

    await driver.get(loginPage);

    // Invalid phone
    const phoneInput = await driver.findElement(By.id('mail'));
    await phoneInput.sendKeys('053a4a');
    await driver.executeScript("document.querySelector('#mail').blur()");
    warningEmail = await driver.findElement(By.id('warningEmail'));
    if (!warningEmail.isDisplayed()) throw new Error('Invalid phone does not give error');
    console.log('PASSED: Invalid phone gives error');

    // Invalid password
    const passwordInput = await driver.findElement(By.id('password'));
    await passwordInput.sendKeys('123');
    await driver.executeScript("document.querySelector('#password').blur()");
    const warningPassword = await driver.findElement(By.id('warningPassword'));
    if (!warningPassword.isDisplayed()) throw new Error('Invalid password does not give error');
    console.log('PASSED: Invalid password gives error');
  },
  async function case2() {
    // Should give error with correct mail / wrong password
    await tryLogin('denizcalkan@hotmail.com', 'munevver');
    try {
      const failText = await driver.findElement(By.className('fail-login-text'));
      const failTextVisible = await failText.isDisplayed();
      if (!failTextVisible) {
        throw new Error('Fail text is not visible after wrong password');
      }
    } catch (error) {
      throw new Error('App is redirected to success page with wrong password');
    }
    console.log('PASSED: Should give error with correct mail / wrong password');

    // Should give error with correct phone / wrong password
    await driver.get(loginPage);
    await tryLogin('05553333333', 'ahmet');
    try {
      const failText = await driver.findElement(By.className('fail-login-text'));
      const failTextVisible = await failText.isDisplayed();
      if (!failTextVisible) {
        throw new Error('Fail text is not visible after wrong password');
      }
    } catch (error) {
      throw new Error(error || 'App is redirected to success page with wrong password');
    }
    console.log('PASSED: Should give error with correct phone / wrong password');

    // Should redirect to success page with correct mail/password
    await driver.get(loginPage);
    await tryLogin('ahmethalac@gmail.com', 'ahmet');
    await checkSuccessPage();
    console.log('PASSED: Should redirect to success page with correct mail/password');

    // Should redirect to success page with correct phone/password
    await driver.get(loginPage);
    await tryLogin('05554444444', 'ahmet');
    await checkSuccessPage();
    console.log('PASSED: Should redirect to success page with correct phone/password');
  },

  async function case3() {
    // Should ask for credentials on login page after a successful login if remember me is not selected
    await tryLogin('ahmethalac@gmail.com', 'ahmet');
    await checkSuccessPage();
    await driver.get(loginPage);
    await driver.sleep(500);
    await checkSuccessPage(false);
    console.log('PASSED: Should ask for credentials on login page after a successful login if remember me is not selected')

    // Login page should redirect to success page if user is logged in before when remember me is clicked
    const rememberMeClick = await driver.findElement(By.id('rememberMe'));
    await rememberMeClick.click();
    await tryLogin('ahmethalac@gmail.com', 'ahmet');
    await checkSuccessPage();
    await driver.get(loginPage);
    await driver.sleep(500);
    await checkSuccessPage();
    console.log('PASSED: Login page should redirect to success page if user is logged in before when remember me is clicked')

    const logoutButton = await driver.findElement(By.id('logout'));
    await logoutButton.click();
    await driver.sleep(500);

  },
  async function case4() {
    // Should not allow Facebook login if there is no corresponding user with the Facebook account
    await loginWithFacebook('without_psnriqd_account@tfbnw.net', 'cs458-bilkent');
    await driver.sleep(500);
    await checkSuccessPage(false);
    console.log('PASSED: Should not allow Facebook login if there is no corresponding user with the Facebook account');

    await driver.manage().deleteAllCookies();
    await driver.executeAsyncScript(function() {
      var callback = arguments[arguments.length - 1];
      FB.logout(callback);
    });

    // Should allow Facebook login if there is a corresponding user with the Facebook account
    await loginWithFacebook('ahmet_jzycbog_feyzi@tfbnw.net', 'cs458-bilkent');
    await driver.sleep(1000);
    await checkSuccessPage();
    console.log('PASSED: Should allow Facebook login if there is a corresponding user with the Facebook account');

  },

  async function case5() {
    const mailInput = await driver.findElement(By.id('mail'));
    await mailInput.sendKeys('denizcalkan@hotmail.com');
    
    // Tabbing from email should continue to password input
    await mailInput.sendKeys(Key.TAB);
    const currentElement = await driver.switchTo().activeElement();
    const currentElementID = await currentElement.getAttribute('id');
    if (currentElementID !== 'password') throw new Error('Tabbing from email do not continue to password');
    console.log('PASSED:  Tabbing from email should continue to password input');
    
    // Using ENTER key should trigger the login request
    const passwordInput = await driver.findElement(By.id('password'));
    await passwordInput.sendKeys('deniz');
    await passwordInput.sendKeys(Key.ENTER);
    await driver.sleep(500);
    checkSuccessPage();
    console.log('PASSED: Using ENTER key should trigger the login request');
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
