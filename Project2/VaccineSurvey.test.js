import { jest } from "@jest/globals";
import { remote } from "webdriverio";
import { DATEPICKER_CONFIRM_BUTTON, GENDER_PICKER_TEXT_XPATH, getDateXpathWithOffset, getPickerItemXpathWithOffset, getYearXpathWithOffset, NEXT_MONTH_BUTTON, PREVIOUS_MONTH_BUTTON, VACCINE_PICKER_TEXT_XPATH, YEAR_SCROLL, YEAR_SELECT } from "./XPATHS";

// eslint-disable-next-line no-undef
jest.setTimeout(100000);
let driver;

const selectDate = async ({day, month, year}) => {
  await driver.pause(500);
  await driver.$(await driver.findElement('xpath', YEAR_SELECT)).click();
  const yearScroll = await driver.$(await driver.findElement('xpath', YEAR_SCROLL));
  let firstYear = await driver.$(await driver.findElement('xpath', getYearXpathWithOffset(0))).getText();
  if (firstYear > year) {
    do {      
      await yearScroll.touchAction([
        { action: 'press', x: 750, y: 0 },
        { action: 'moveTo', x: 0, y: 0 },
        'release'
      ]);
      firstYear = await driver.$(await driver.findElement('xpath', getYearXpathWithOffset(0))).getText();
    } while (firstYear > year);
  } else {
    do {      
      await yearScroll.touchAction([
        { action: 'press', x: 0, y: 0 },
        { action: 'moveTo', x: 750, y: 0 },
        'release'
      ]);
      firstYear = await driver.$(await driver.findElement('xpath', getYearXpathWithOffset(0))).getText();
    } while (parseInt(firstYear) + 5 < year);
  }
  
  await driver.$(await driver.findElement('xpath', getYearXpathWithOffset(year - firstYear))).click();

  const dateText = await driver.$(await driver.findElement('xpath', getDateXpathWithOffset(0))).getAttribute('content-desc');
  const currentMonth = new Date(dateText).getMonth() + 1;

  for (let i = 0; i < Math.abs(currentMonth - month); i++) {   
    await driver.$(await driver.findElement('xpath', currentMonth > month ? PREVIOUS_MONTH_BUTTON : NEXT_MONTH_BUTTON)).click();
  }

  await driver.$(await driver.findElement('xpath', getDateXpathWithOffset(day - 1))).click();
  await driver.$(await driver.findElement('xpath', DATEPICKER_CONFIRM_BUTTON)).click();
};

const pickItem = async index => {
  await driver.pause(500);
  await driver.$(await driver.findElement('xpath', getPickerItemXpathWithOffset(index))).click();
};
const setName = async name => await driver.$("~nameInput").setValue(name);
const setSurname = async surname => await driver.$("~surnameInput").setValue(surname);
const setBirthDate = async birthDate => {
  await driver.$("~birthDateText").click();
  await selectDate(birthDate);
};
const setCity = async city => await driver.$("~cityInput").setValue(city);
const setGender = async gender => {
  const genderMap = { male: 1, female: 2, other: 3 };
  await driver.$("~genderPicker").click();
  await pickItem(genderMap[gender]);
}
const setVaccineType = async vaccineType => {
  const vaccineMap = { biontech: 1, sinovac: 2 };
  await driver.$("~vaccineTypePicker").click();
  await pickItem(vaccineMap[vaccineType]);
}
const setSideEffect = async sideEffect => await driver.$("~sideEffectInput").setValue(sideEffect);
const setExtra = async extra => await driver.$("~extraInput").setValue(extra);
const fillWithValidData = async () => {
  const dummyData = { 
    name: "John", 
    surname: "Doe", 
    birthDate: { day: 17, month: 1, year: 2004 }, 
    city: "London", 
    gender: 'male', 
    vaccineType: 'sinovac',
    sideEffect: 'Fever and headache',
    extra: 'I have tested positive after 3 weeks from the third dose'
  };
  await setName(dummyData.name); // Fill name field
  await setSurname(dummyData.surname); // Fill surname field
  await setBirthDate(dummyData.birthDate); // Select birth date
  await setCity(dummyData.city) // Select city
  await setGender(dummyData.gender) // Select gender
  await setVaccineType(dummyData.vaccineType) // Select vaccine type
  await setSideEffect(dummyData.sideEffect); // Fill side effect field
  await setExtra(dummyData.extra); // Fill positive cases field
  await driver.pause(500);

  // Format the data to be matched with the expected data
  const { gender, vaccineType, birthDate: { day, month, year } } = dummyData;
  return {
    ...dummyData,
    birthDate: `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`,
    gender: gender.charAt(0).toUpperCase() + gender.slice(1),
    vaccineType: vaccineType.charAt(0).toUpperCase() + vaccineType.slice(1),
  };
};

describe('Vaccine Survey tests', () => {
  beforeAll(async () => {
    driver = await remote({
      path: "/wd/hub",
      host: "localhost",
      port: 4723,
      capabilities: {
        platformName: "android",
        platformVersion: process.env.PLATFORM_VERSION, // must correct the stimuator
        deviceName: process.env.DEVICE, // must correct the stimuator
        automationName: 'UiAutomator2',
      },
      logLevel: 'silent'
    });
  });
  
  afterAll(async () => {
    if (driver) {
      await driver.deleteSession();
    }
  });

  beforeEach(async () => {
    await driver.hideKeyboard();
    if (await driver.$("~successPage").isExisting()) {
      await driver.$("~fillAgainButton").click();
    } else {
      await driver.$("~resetButton").click();
    }
    await driver.pause(500);
  });

  test("Should show Send button only if all inputs are valid", async () => {
    const sendButton = await driver.$("~sendButton");

    // Send button should not be visible if all inputs are empty
    expect(await sendButton.isDisplayed()).toBe(false);
  
    await fillWithValidData();

    // Send button should be visible after filling all inputs
    expect(await sendButton.isDisplayed()).toBe(true);
  });

  test("Should show error messages on invalid inputs and hide send button if there are any error message exists", async () => {
    // For all inputs, first show error by leaving it empty, then fill it with valid value to check if error disappears

    // Name field
    await driver.$("~nameInput").click();
    await driver.$("~nameError").click(); // Click another text to lose focus
    expect(await driver.$("~nameError").getText()).not.toBe("");
    await setName('John');
    expect(await driver.$("~nameError").getText()).toBe("");

    // Surname field
    await driver.$("~surnameInput").click();
    await driver.$("~surnameError").click(); // Click another text to lose focus
    expect(await driver.$("~surnameError").getText()).not.toBe("");
    await setSurname('Doe');
    expect(await driver.$("~surnameError").getText()).toBe("");

    // Birth date field
    await setBirthDate({ day: 4, month: 2, year: 2005 }); // Invalid birth date because age is less than 18
    expect(await driver.$("~birthDateError").getText()).not.toBe("");
    await driver.pause(500);
    await setBirthDate({ day: 17, month: 1, year: 2001 }); // Valid birth date
    expect(await driver.$("~birthDateError").getText()).toBe("");

    // City field
    await driver.$("~cityInput").click();
    await driver.$("~cityError").click(); // Click another text to lose focus
    expect(await driver.$("~cityError").getText()).not.toBe("");
    await setCity('London');
    expect(await driver.$("~cityError").getText()).toBe("");

    await setGender('female');
    await setVaccineType('biontech');

    // Side effect field
    await driver.$("~sideEffectInput").click();
    await driver.$("~sideEffectError").click(); // Click another text to lose focus
    expect(await driver.$("~sideEffectError").getText()).not.toBe("");
    await setSideEffect('Fever and headache');
    expect(await driver.$("~sideEffectError").getText()).toBe("");

    // Extra field
    await driver.$("~extraInput").click();
    await driver.$("~sideEffectError").click(); // Click another text to lose focus
    expect(await driver.$("~extraError").getText()).not.toBe("");
    await setExtra('I have tested positive after 3 weeks from the third dose');
    expect(await driver.$("~extraError").getText()).toBe("");

    const sendButton = await driver.$("~sendButton");
    expect(await sendButton.isDisplayed()).toBe(true);
    await setBirthDate({ day: 4, month: 2, year: 2005 });
    // If there is an error, check whether send button is still visible or not
    expect(await sendButton.isDisplayed()).toBe(false);

  });

  const checkEmptySurvey = async () => {
    expect(await driver.$("~nameInput").getText()).toBe("Enter name");
    expect(await driver.$("~surnameInput").getText()).toBe("Enter surname");
    expect(await driver.$("~birthDateText").getText()).toBe("Enter birth date");
    expect(await driver.$("~cityInput").getText()).toBe("Enter city");
    expect(await driver.$(await driver.findElement('xpath', GENDER_PICKER_TEXT_XPATH)).getText()).toBe("Select");
    expect(await driver.$(await driver.findElement('xpath', VACCINE_PICKER_TEXT_XPATH)).getText()).toBe("Select");
  };

  test("Should reset the values on reset button click and display the success page on send button click", async () => {
    await fillWithValidData();
    await driver.$("~resetButton").click();
    await driver.pause(500);
    await checkEmptySurvey();

    await fillWithValidData();
    await driver.$("~sendButton").click();
    expect(await driver.$("~successPage").isDisplayed()).toBe(true);
  });

  test('Should open an empty survey on fill again button click', async () => {
    await fillWithValidData();
    await driver.$("~sendButton").click();
    await driver.$("~fillAgainButton").click();
    await checkEmptySurvey();
  });

  test('Should open the survey with the submitted data on edit submission click', async () => {
    const submitData = await fillWithValidData();
    await driver.$("~sendButton").click();
    await driver.$("~editSubmissionButton").click();
    expect(await driver.$("~nameInput").getText()).toBe(submitData.name);
    expect(await driver.$("~surnameInput").getText()).toBe(submitData.surname);
    expect(await driver.$("~birthDateText").getText()).toBe(submitData.birthDate);
    expect(await driver.$("~cityInput").getText()).toBe(submitData.city);
    expect(await driver.$(await driver.findElement('xpath', GENDER_PICKER_TEXT_XPATH)).getText()).toBe(submitData.gender);
    expect(await driver.$(await driver.findElement('xpath', VACCINE_PICKER_TEXT_XPATH)).getText()).toBe(submitData.vaccineType);
    expect(await driver.$("~sideEffectInput").getText()).toBe(submitData.sideEffect);
    expect(await driver.$("~extraInput").getText()).toBe(submitData.extra);

  });
});
