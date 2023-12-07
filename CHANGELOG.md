# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Please note that the date associated with a release is the date the code
was committed to the `production` branch. This is not necessarily the date that
the code was deployed.

## [Unreleased]

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

[unreleased]: https://github.com/bravetechnologycoop/particle-accelerator/compare/v2.0.0...HEAD
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
