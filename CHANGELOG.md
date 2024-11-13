# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Please note that the date associated with a release is the date the code
was committed to the `production` branch. This is not necessarily the date that
the code was deployed.

## [Unreleased]

### Added

- Added client dropdown to client particle functions tool (CU-86dv68thj).
- Added device type to dashboard configuration in the PA renamer (CU-86duvwbq2).

### Changed

- Updated the database function insertSensorLocation to handle device_type field (CU-86duvwbq2). 

## [3.2.1] - 2024-10-18

### Added

- Added scrolling to client particle functions page - fixed bug (CU-86duybbue).

## [3.2.0] - 2024-10-17

### Added

- Added more environment variables (PARTICLE_API_KEY, database credentials) (CU-86dupwqgq).
- New tool: Particle Client Functions for calling particle functions for all devices of client (CU-86due80fw).
- Added new react page for particle client functions tool - core component code in src/views/ClientParticleFunctions.jsx (CU-86due80fw).
- Added new database function - getClientDevices; that retrieves devices owned by a client (CU-86due80fw).
- Added three new particle functions - getFirmwareVersion, getFunctionList, callClientParticleFunction - all used as utility functions that interact with Particle JS SDK (CU-86due80fw).

### Changed

- Updated README.md: pa dev database name (CU-86durxb29).
- Updated home page to display information about particle client functions tool (CU-86due80fw).

## [3.1.0] - 2024-08-20

### Added

- Configured repository to use Github Actions instead of Travis (CU-86dthadwg).
- Added new environment value `REACT_APP_ENV` to disable google login if local (CU-86dtx3b7n).
- Added Uptime and Downtime messages in `Message Clients` page for easy copy pasting (CU-86du6rgt5).

### Changed

- Updated `App.js` to disable google login if `REACT_APP_ENV` in `.env` is local (CU-86dtx3b7n).
- Updated `.env.example` to reflect new environment `REACT_APP_ENV` (CU-86dtx3b7n).

## [3.0.0] - 2024-07-02

### Added

- Added new item to allowlist for `braces` npm package being out of date (CU-86dtuapr4).

### Changed

- Updated `webpack-dev-middleware` npm package (CU-86dtuapr4).
- Removed door sensor pairing page (CU-860ravwq2).
- Updated `ws` npm package (CU-86dtuv7h6).
- Updated all the images in the Sensor Provisioning Guide (CU-860ravv7d).
- Removed steps 1 and 11 completely (CU-860ravv7d).
- Changed steps 6,7, and 8 to reflect the updated method of pairing the Door Sensor to the Boron (CU-860ravv7d).
- Re-ordered the steps to account for missing removed steps (CU-860ravv7d).
- Added boron light statuses in step 4 (CU-860ravv7d).
- Changed all instances of IM21 to IM24 (CU-860ravv7d).
- Updated door statuses in step 8 to the more accurate, newer ones (CU-860ravv7d).
- Separated testing door sensor and boron sensor into 2 different steps (CU-860ravv7d).
- Changed the label printer in step 12 into the currently in use (CU-860ravv7d).

## [2.2.0] - 2023-12-18

### Added

- System Status page to check server and database connections (CU-86dqkw7ef).

## [2.1.0] - 2023-12-08

### Added

- Message Clients page and interaction with PA API call /pa/message-clients (CU-w9bcb5).

## [2.0.0] - 2023-12-01

### Added

- Google login screen and page (CU-3denbe6).

### Changed

- Renamer to authenticate with the PA API using Google (CU-3denbe6).
- Button Registration to authenticate with the PA API using Google (CU-3denbe6).
- Twilio Number Purchasing to authenticate with the PA API using Google (CU-3denbe6).

## [1.8.0] - 2023-10-12

### Changed

- Updated favicon image from old logo to current logo (CU-8678w897a).
- Upgrade Node JS to 18.16.1 (CU-860raw01r).

## [1.7.0] - 2023-07-13

### Changed

- Upgrade Node JS to 16.20.1.
- Travis runs on Ubuntu 18.04.

## [1.6.0] - 2023-04-24

### Fixes

- Activator explicitly adds the Boron Device to the selected Product (CU-860qkqnnn).

## [1.5.0] - 2023-02-07

### Security

- Update dependencies (CU-860phzbq5).

## [1.4.0] - 2022-12-16

### Added

- Travis configuration.

### Changed

- Updated to our newest logo and branding colours (3cqnpkw).

### Removed

- Ability to select firmware state machine true/false in Renamer (CU-m0we0t).

### Security

- Updated dependencies.
- Added `npm audit` check to Travis.
- Added Particle 2FA (CU-2nvab4u).

## [1.3.0] - 2022-07-26

### Changed

- Improved error messaging in Twilio Number Purchasing.
- Improved error messaging and status display in Renamer.

### Added

- Ability to use an existing Twilio phone number when adding a new Sensor to the Dashboard using the Renamer (CU-2fk3y8a).

### Removed

- RadarType dropdown menu in the Renamer.

## [1.2.0] - 2022-07-14

### Changed

- Sensor Provisioning Guide step 6 to include maching door sensor address.
- Typo on the Particle CLI command and its corresponding image.
- Labels on the Twilio Number Purchasing page for more clarification. (CU-2mdcnzt)

## [1.1.0] - 2022-05-19

### Changed

- Added versioning and CHANGELOG structure.
- Added deployment instructions.

## [1.0.0] - 2022-05-02

### Added

- Initial version (CU-21ghk0x).

[unreleased]: https://github.com/bravetechnologycoop/particle-accelerator/compare/v3.1.0...HEAD
[3.1.0]: https://github.com/bravetechnologycoop/particle-accelerator/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/bravetechnologycoop/particle-accelerator/compare/v2.2.0...v3.0.0
[2.2.0]: https://github.com/bravetechnologycoop/particle-accelerator/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/bravetechnologycoop/particle-accelerator/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/bravetechnologycoop/particle-accelerator/compare/v1.8.0...v2.0.0
[1.8.0]: https://github.com/bravetechnologycoop/particle-accelerator/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/bravetechnologycoop/particle-accelerator/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/bravetechnologycoop/particle-accelerator/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/bravetechnologycoop/particle-accelerator/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/bravetechnologycoop/particle-accelerator/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/bravetechnologycoop/particle-accelerator/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/bravetechnologycoop/particle-accelerator/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/bravetechnologycoop/particle-accelerator/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/bravetechnologycoop/BraveSensor/releases/tag/v1.0.0
