## Project Structure
| File | Explanation |
|-|-|
| App.js | Main file for the vaccine survey application |
| VaccineSurvey.test.js | Main file for the tests |
| CONFIGURATIONS | COnfiguration file for the tests to work properly |
| Remaining Files | Expo files for the mobile application |


## How to Run
Run `yarn install` or `npm run install` in order to install the dependencies.  
Refer to [installation guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if you don't have `yarn` or `npm`

### Project
You need to have an available Android emulator on your machine in order to start the mobile application.  
If you have already, run `yarn start` or `npm run start` in order to start the project.

### Tests
Before running the tests, Appium must be configured by filling the necessary configurations in `CONFIGURATIONS` file.
| Configuration | Explanation |
| - | - |
| ANDROID_HOME | Home directory for Android SDK |
| JAVA_HOME | Home directory for Java Runtime Environment |
| PLATFORM_VERSION | Android version of the targeted emulator |
| DEVICE | Name of the emulator, usually 'Android Emulator' |

After, first running `yarn appium` and then running `yarn test` will run the tests on the mounted emulator.  


#### Test Cases

Test Case #1: App should show Send button only if all inputs are filled

Test Case #2: App should show error messages on invalid inputs and hide send button if there are any error messages

Test Case #3: App should reset the values on reset button click and display the success page on send button click

Test Case #4: App should open an empty survey on fill again button click from success page

Test Case #5: App should open the survey with the submitted data on edit submission click from success page


