// Order matters!
const Pages = {
  home: {
    displayName: 'Home',
    paths: ['/', '/home'],
    authorizations: {
      clickup: false,
      particle: false,
    },
    loginBadge: false,
    isInNavBar: true,
  },
  sensorGuide: {
    displayName: 'Sensor Provisioning Guide',
    paths: ['/sensor-provisioning-guide'],
    authorizations: {
      // The sensor guide is protected because there are links that contain sensitive details inside the page.
      clickup: true,
      particle: false,
    },
    loginBadge: false,
    isInNavBar: true,
  },
  particle: {
    displayName: 'Particle',
    paths: ['/particle'],
    authorizations: {
      clickup: false,
      particle: false,
    },
    loginBadge: true,
    isInNavBar: true,
  },
  clickup: {
    displayName: 'ClickUp',
    paths: ['/clickup'],
    authorizations: {
      clickup: false,
      particle: false,
    },
    loginBadge: true,
    isInNavBar: true,
  },
  deviceManager: {
    displayName: 'Device Manager',
    paths: ['/device-manager'],
    authorizations: {
      clickup: true,
      particle: false,
    },
    loginBadge: false,
    isInNavBar: true,
  },
  activator: {
    displayName: 'Activator',
    paths: ['/activator'],
    authorizations: {
      clickup: true,
      particle: true,
    },
    loginBadge: false,
    isInNavBar: true,
  },
  deviceLookup: {
    displayName: 'Device Lookup',
    paths: ['/device-lookup'],
    authorizations: {
      clickup: false,
      particle: true,
    },
    loginBadge: false,
  },
  doorSensorPairing: {
    displayName: 'Door Sensor Pairing',
    paths: ['/door-sensor-pairing'],
    authorizations: {
      clickup: true,
      particle: true,
    },
    loginBadge: false,
    isInNavBar: true,
  },
  renamer: {
    displayName: 'Renamer',
    paths: ['/renamer'],
    authorizations: {
      clickup: true,
      particle: true,
    },
    loginBadge: false,
    isInNavBar: true,
  },
  buttonRegistration: {
    displayName: 'Button Registration',
    paths: ['/button-registration'],
    authorizations: {
      clickup: true,
      particle: false,
    },
    loginBadge: false,
    isInNavBar: true,
  },
  twilio: {
    displayName: 'Twilio Number Purchasing',
    paths: ['/twilio-number-purchasing'],
    authorizations: {
      clickup: true,
      particle: false,
    },
    loginBadge: false,
    isInNavBar: true,
  },
  dashboard: {
    displayName: 'Dashboard',
    paths: ['/dashboard'],
    authorizations: {
      clickup: true,
      particle: true,
    },
    loginBadge: false,
    isInNavBar: true,
  },
  sensorEdit: {
    displayName: 'Sensor Editor',
    paths: ['/dashboard/clients/:clientId/sensors/:sensorId/edit'],
    authorizations: {
      clickup: true,
      particle: true,
    },
    loginBadge: false,
    isInNavBar: false,
  },
}

export default Pages
