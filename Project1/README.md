## Project Structure
| File | Explanation |
|-|-|
| index.html | HTML file for the main Netflix login page. |
| success.html | HTML file for the success page that is shown after login. |
| style.css | Necessary stylings for the application. |
| script.js | JavaScript file for the business logic of the application |
| db.json | Dummy user database that is used by `json-server` package |
| test.js | Test runner file which includes all 5 test cases in it |


## How to Run
Run `yarn install` or `npm run install` in order to install the dependencies. Refer to [installation guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if you don't have `yarn` or `npm`

### Project
Run `yarn start` or `npm run start` in order to start the project.
You can access the website from https://localhost:443 after starting.

### Tests
Run `yarn test` or `npm run test` in order to run the tests  
**WARNING:** Please don't run tests while `yarn start` is still running!

#### Test Facebook Accounts
> **With corresponding account**  
> mail: ahmet_jzycbog_feyzi@tfbnw.net  
> password: cs458-bilkent

> **Without corresponding account**  
> mail: without_psnriqd_account@tfbnw.net  
> password: cs458-bilkent

#### Test Cases

Test Case #1: Verify that validations of email, phone and password fields work correctly.

Test Case #2: Verify credential pairs correspond to a user.

Test Case #3: Verify that the remember me checkbox works correctly.

Test Case #4: Verify Facebook login works correctly.

Test Case #5: Verify that the Enter/Tab key works as a substitute for moving forward to the next textbox and Sign in button.

