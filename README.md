## About

The following are the features of **Account** Module
* Provides user interfaces for **Tenant Admin** to manage users and groups
* **Manage Users** - Enables tenant admin to perform the following operations
    * ***Create*** - Create a new user
    * ***Update*** - Update exisitng user details
    * ***Delete*** - Delete a user
    * ***View*** - View user details
    * ***Search*** - Search for users based on username,firstname,lastname, mobile, email etc
    * ***Activate*** - Activate user so that user in this tenant can access his applications
    * ***DeActivate*** - DeActivate user so that user in this tenant is restricted to access his applications
    * ***Assign Groups*** - assign groups to user
    * ***Assign Roles*** - assign roles to user
* **Manage Groups** - Enables tenant admin to perform the following operations
    * ***Create*** - Create a new group
    * ***Update*** - Update exisitng group details
    * ***Delete*** - Delete a group
    * ***View*** - View group details
    * ***Search*** - Search for groups based on group name
    * ***Assign Roles*** - assign roles (available roles in keycloak) to a group

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Docker build and run
docker build . -t awgment-ui-account

docker run -p 8181:80 --env-file docker.env awgment-ui-account:latest

curl localhost:8181/model/config.json

## Prerequisites

1. Make sure node is installed in your system.

2. Install Yarn using <a href="https://classic.yarnpkg.com/en/docs/install">this</a>.

3. Go to the checked out project folder and run the command `yarn install` 

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn run build:development`

Builds the app for development (takes .env.development) to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn run build:qa`

Builds the app for staging (takes .env.qa) to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn run build:production`

Builds the app for production (takes .env.production) to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn run typescript`

To check the typescript errors

### `yarn run lint`

To check the eslint errors

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
