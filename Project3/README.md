You can access the final version of this project from [here](https://ahmethalac.github.io/CS458-SoftwareTesting-Projects/Project3)

## Project Structure
| File | Explanation |
|-|-|
| index.html | HTML file for the main page. |
| style.css | Necessary stylings for the application. |
| script.js | JavaScript file for the business logic of the application |
| test.js | Test runner file which includes all 5 test cases in it |


## How to Run
Run `yarn install` or `npm run install` in order to install the dependencies. Refer to [installation guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if you don't have `yarn` or `npm`

### Project
Run `yarn start` or `npm run start` in order to start the project.
You can access the website from https://localhost:3000 after starting.

### Tests
Run `yarn test` or `npm run test` in order to run the tests  
**WARNING:** Please don't run tests while `yarn start` is still running!

#### Test Cases

Test Case #1: App should show the correct country for various different locations.

Test Case #2: App should correctly calculate the distance to Geographic North Pole.

Test Case #3: App should show the correct country for current location.

Test Case #4: App should correctly calculate the distance between specified location and Geographic North Pole.

Test Case #5: App should handle invalid latitude/longitude inputs by giving errors

Test Case #5: App should give error if there is no country with the specified coordinates

Test Case #6: App should give error if no country information found for specified location

Test Case #7: App should correctly calculate the distance to moon for both current location and specified coordinates
