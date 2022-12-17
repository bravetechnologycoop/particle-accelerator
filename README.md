[![Build Status](https://app.travis-ci.com/bravetechnologycoop/particle-accelerator.svg?branch=main)](https://app.travis-ci.com/bravetechnologycoop/particle-accelerator)

# The PA/Personal Assistant/Particle Accelerator/Papa Alpha...

## Deployment instructions

### Deploy to production

---

1. On your local machine, in the `particle-accelerator` repository:
   1. Pull the latest code ready for release: `git checkout main && git pull origin main`
   1. Decide on an appropriate version number for the new version
   1. Update `CHANGELOG.md` by moving everything in `Unreleased` to a section for the new version
   1. Make a new commit directly on `main` which updates the CHANGELOG
   1. Tag the new commit - for example, if the version number is v1.0.0, use `git tag v1.0.0`
   1. Push the new version to GitHub: `git push origin main --tags`
   1. Update the `production` branch: `git checkout production && git merge main && git push origin production`
1. Make any changes to the environment variables
   1. Navigate to Digital Ocean --> Apps --> particle-accelerator
   1. Navigate to Settings --> Components: particle-accelerator
   1. Beside "Environment Variables", click "Edit"
   1. Make changes
   1. Click "Save"
1. Deploy on Digital Ocean
   1. In Digital Ocean --> Apps --> particle-accelerator
   1. Click Actions --> Deploy

### Deploy to dev

---

1. Make any changes to the environment variables
   1. Navigate to Digital Ocean --> Apps --> particle-accelerator-dev
   1. Navigate to Settings --> Components: particle-accelerator
   1. Beside "Environment Variables", click "Edit"
   1. Make changes
   1. Click "Save"
1. Update the branch that will be deployed anytime a new commit it made
   1. Navigate to Digital Ocean --> Apps --> particle-accelerator-dev
   1. Navigate to Settings --> Components: particle-accelerator
   1. Beside "Source", click "Edit"
   1. Select the branch that you want to have automatically deployed from the "Branch" dropdown list
   1. Click "Save"

### Deploy to localhost

---

1. Make any changes to the environment variables in `.env`
1. Run `npm ci` to download dependencies
1. Run `npm start` to build and deploy to http://localhost:3000

## Principles of the Program

### Prop Tree

---

- The props in the Accelerator are passed on the following hierarchy:

  1. `App.js`
  2. `RouterInterface.jsx`
  3. `Navigation.jsx` or `Frame.jsx`
  4. (from `Frame.jsx`) -> `views`
  5. (from `Frame.jsx` and `views`) -> other individual components

- Passing props between all of the various levels is somewhat tedious.
- I enclosed every `setState` within an arbitrary `changeState` function. I'm unsure how necessary this was but various guides have advised for this approach. (https://webomnizz.com/change-parent-component-state-from-child-using-hooks-in-react/)

### File Organization

---

- Files and components are organized in four main folders.
  - `components` - Every subcomponent is stored in a subdirectory labelled after the parent component, unless it is a `general` component.
  - `utilities` - Every 'middle-end' function that assists the accelerator, as well as classes and constants.
  - `views` - Every view seen by `Frame.jsx`
  - `pdf` - Components that produce the button labels
  - `stylesheets` - `.css` files for particular uses.
  - `graphics` - SVGs for use in various pages
  - `upper-level-components` - components (and `Pages.js`) for use in the higher level abstractions of the program
    (`Frame.jsx`, `Navigation.jsx`, `PageNotFound.jsx`, `Pages.js`, and `RouterInterface.jsx`)

### Environment Variables

---

Environment Variables in the PA are done in DigitalOcean. Each environment variable must be preceded by `REACT_APP_`, for example: `REACT_APP_TWILIO_MESSAGING_SID`. Environment variables are to be added at the component level, not the app level.

A `.env.example` file can also be found in this repo.

### Strange Artefacts

---

- `token` means `particleToken` if not defined. This is an artefact from when the program used to only deal with tokens from Particle.

### Styling and CSS

---

- The PA makes use of CSS in three main ways:
  1. (main, desirable, way) css-in-js `styles` constants containing CSS.
  2. Stylesheets in the `stylesheets` directory: used only for styling hovers and clicking properties, or existing components (harder to do in css-in-js)
  3. Inline styles, which are regretted and frowned upon. A future make-work project would be to remove the heavy usage of inline styles in this project.

### History

---

The PA started as the 'Particle Accelerator' and was only meant to activate Borons, and check them with the Device Lookup page (then called the Validator).
At this time, the PA was also an Electron app and ran on the desktop. As time progressed, it was deemed more viable for the PA
to become a React web app, so the original Electron react was flipped over to the browser. A navigation bar was added, and
from there, features were rapidly added. Due to the very primitive nature of the first releases of the PA, there may exist
some pockets of code that don't quite fit the style of the rest of the project.

### General Format

---

Nearly all of the tools in the PA work on the following basis:

1. User inputs information
2. User clicks 'submit'
3. A react hook containing the status of the request is set to `loading` or something of the like, which updates a badge/spinner to indicate loading to the user
4. A request for the data/operation/etc is handled with `async/await` while the user waits
5. Based on the response from the operation in step 4, the hook containing the status is updated to show the user the result of their input.
6. Whatever data is returned is supplied to a hook/function/variable, etc.

### Clickup-as-a-databse

---

The PA attempts to use Clickup [the PA Tracker] as a primitive database. This is done in two main ways:

1. The Device Manager allows the user to pull devices from the tracker into local memory on demand
2. At every step of the provisioning process, the PA will only update fields on an ActivatedDevice if the operation on the clickup backend is successful. Therefore, they PA tracker and the PA will stay in sync. Discrepancies will only arise if edits are made on the clickup end, but a device can always be popped and readded from the local memory to prevent this.

## How-Tos

### Adding a New Page

---

1. Create a new page in the `Pages.js` file. The format is the following:

   ```js
   // ...
   const Pages = {
     developerName: {
       displayName: 'Name for navigation and identification',
       paths: ['/array', '/of', '/the', '/desired', '/routes', '/for/the/page'],
       authorizations: {
         // Whether clickup or particle are required to access the page or not
         // Should always be declared whether true or false.
         clickup: true,
         particle: false,
       },
       // Whether the page will have a loginState badge in the navbar. Generally not touched.
       loginBadge: false,
     },
   }
   ```

2. If the page has `loginBadge: true`, then one must add the variables for the device in `Navigation.jsx`:

   ```js
   loginButtonConfig[Pages.developerName.displayName] = {
     // Hook to display what the current login state for that account is.
     loginState: hook,
     // Function to change the token (in case one would like to add a logout button to the badge)
     // Should probably be deprecated.
     changeToken: function,
     // Username to display on the badge if login is successful
     userName: hook,
   }
   ```

3. Add the component to the component config object in `Frame.jsx`

   ```jsx
   viewConfig[Pages.developerName.displayName] = <ComponentName properties={goHere} />
   ```

## Roadmap

### Tier 1

- Add a better encryption mechanism for the entire site (Google OAuth?)

### Tier 2

- [moderate] Verify the AWS and database adding and switch the variables to prod

### Tier 3

- [good cost-benefit] Synthesize the database inserts, AWS functionality, and phone number adding into one cohesive tool to register buttons.
- [large endeavour] Automated sensor testing with the `getEventStream` function in Particle and `Chart.js`
  - https://docs.particle.io/reference/SDKs/javascript/#geteventstream-1
  - https://www.chartjs.org/
- [good cost-benefit] More streamlined sensor activation, less configuration, automatic sensor_XX incrementing, essentially just using the scanner and the return character to do everything
- [moderate] Make the validator look nice again
- [moderate] Toggle between Dev/Prod/Staging modes, etc.

### Tier 4

- [large endeavour] Back the application with a database
- [decent cost-benefit] Create a (desktop application) serial tool that interfaces with an accelerator endpoint to automatically register every button
- OAuth2 Flow for Particle
- Create automated tests for the entire application, unit, integration, end-to-end, etc.

### Random Dev Make Work Tasks

- Remove all instances of inline CSS
