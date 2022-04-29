# The PA/Personal Assistant/Particle Accelerator/Papa Alpha...

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

#### File Organization

- Files and components are organized in four main folders.
  - `components` - Every subcomponent (although some are stored inside the views themselves if they are specific)
  - `utilities` - Every 'middle-end' function that assists the accelerator
  - `views` - Every view seen by `Frame.jsx`
  - `pdf` - Components that produce the button labels

### Environment Variables

---
Environment Variables in the PA are done in DigitalOcean. Each environment variable must be preceded by `REACT_APP_`, for example: `REACT_APP_TWILIO_MESSAGING_SID`. Environment variables are to be added at the component level, not the app level.

### Development Environments

---

### Strange Artefacts

---
- `token` generally means `particleToken`

### Styling and CSS

### History

### General Format

---
Nearly all of the tools in the PA work on the following basis:
1. User inputs information
2. User clicks 'submit'
3. A react hook containing the status of the request is set to `loading` or something of the like, which updates a badge/spinner to indicate loading to the user.
4. A request for the data/operation/etc is handled with `async/await` while the user waits
5. Based on the response from the operation in step 4, the hook containing the status is updated to show the user the result of their input.
6. Whatever data is returned is supplied to a hook/function/variable, etc.

## How-Tos

### Adding a New Page

---
1. Create a component in the `views` folder.
2. In `App.js`, name the `ViewState` with a name of your choice.
3. Make the `path` a kebab-cased version of the `ViewState` name (important).
4. Add an `if` statement in `Frame.jsx` following the format:
```jsx
if (viewState === 'View State Name No Kebab Case') {
  return <ComponentNameInViews />
} 
```
5. Create a `RowButton` in `components/Navigation.jsx`, with care to the order that you would like the page to appear in the navigation.

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
- Create automated tests for the entire application, unit, integration, etc.

### Random Dev Make Work Tasks
- Remove all instances of inline CSS
- Make Door Sensor Pairing single-action instead of interval.
