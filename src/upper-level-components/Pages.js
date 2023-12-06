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
  },
  google: {
    displayName: 'Google',
    paths: ['/google'],
    authorizations: {
      clickup: false,
      particle: false,
    },
    loginBadge: true,
  },
  particle: {
    displayName: 'Particle',
    paths: ['/particle'],
    authorizations: {
      clickup: false,
      particle: false,
    },
    loginBadge: true,
  },
  clickup: {
    displayName: 'ClickUp',
    paths: ['/clickup'],
    authorizations: {
      clickup: false,
      particle: false,
    },
    loginBadge: true,
  },
  deviceManager: {
    displayName: 'Device Manager',
    paths: ['/device-manager'],
    authorizations: {
      clickup: true,
      particle: false,
    },
    loginBadge: false,
  },
  activator: {
    displayName: 'Activator',
    paths: ['/activator'],
    authorizations: {
      clickup: true,
      particle: true,
    },
    loginBadge: false,
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
  },
  renamer: {
    displayName: 'Renamer',
    paths: ['/renamer'],
    authorizations: {
      clickup: true,
      particle: true,
    },
    loginBadge: false,
  },
  buttonRegistration: {
    displayName: 'Button Registration',
    paths: ['/button-registration'],
    authorizations: {
      clickup: false,
      particle: false,
    },
    loginBadge: false,
  },
  twilio: {
    displayName: 'Twilio Number Purchasing',
    paths: ['/twilio-number-purchasing'],
    authorizations: {
      clickup: false,
      particle: false,
    },
    loginBadge: false,
  },
  messageClients: {
    displayName: 'Message Clients',
    paths: ['/message-clients'],
    authorizations: {
      clickup: false,
      particle: false,
    },
    loginBadge: false,
  },
}

export default Pages
