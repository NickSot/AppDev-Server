# Setup Tutorial

## Run the following commands in the cmd as administrator:
- `npm install` - this command installs all of the packages that enable you to write gateways in the API
- `npm run dev` - this command runs the project in development environment, meaning the following:
    - when you change the code, it is compiled automatically, so you don't have to rerun the command
    - you just have to refresh the page in order to view the result of the code changes
- `npm run test` - this command runs all the tests written

## Open a second cmd, and type the following commands:
- `tsc -w` - typed in the root project folder, this command will make sure that the transpiler of typescript is running
and tracks the changes while we write code
    
## DB setup
- install MYSQL Server and MYSQL Workbench
- run the script provided in the root folder (db.sql)
- create a file, named `sql_credentials.json`, which should be of the form: `{"password": "youmysqlpassword"}`
- the API should now be able to connect to the database

## Files and their purposes
- index.ts - this is where all server code is combined and transpiled
- test/tests.ts - this is where all test code is combined and transpiled
- dist/*.js - this is the directory where all transpiled files from typescript to javascript are generated and executed
