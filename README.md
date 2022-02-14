# Setup Tutorial

## Run the following commands in the cmd as administrator:
- `npm install` - this command installs all of the packages that enable you to write gateways in the API
- `npm run dev` - this command runs the project in development environment, meaning the following:
    - when you change the code, it is compiled automatically, so you don't have to rerun the command
    - you just have to refresh the page in order to view the result of the code changes
- `npm run test` - this command runs all the tests written
    
## Files and their purposes
- index.ts - this is where all server code is combined and transpiled
- test/tests.ts - this is where all test code is combined and transpiled
- dist/*.js - this is the directory where all transpiled files from typescript to javascript are generated and executed