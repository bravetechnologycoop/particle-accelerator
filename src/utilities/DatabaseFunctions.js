import { Environments } from './Constants'

const axios = require('axios')

const BRAVE_API_KEY_DEV = process.env.REACT_APP_BRAVE_API_KEY_DEV
const BRAVE_API_KEY_STAGING = process.env.REACT_APP_BRAVE_API_KEY_STAGING
const BRAVE_API_KEY_PROD = process.env.REACT_APP_BRAVE_API_KEY_PROD

const SENSOR_DEV_URL = process.env.REACT_APP_SENSOR_DEV_URL
const SENSOR_PROD_URL = process.env.REACT_APP_SENSOR_PROD_URL
const SENSOR_STAGING_URL = process.env.REACT_APP_SENSOR_STAGING_URL

/**
 * getSensorClients: retrieves the list of clients in the Brave sensor DB, uses the sensors backend.
 * @param {string} environment       which server to retrieve clients from
 * @param {string} clickupToken      clickup token
 * @return {Promise<{name: string, id: string}[]>}   array of client names and ids if successful, empty if not.
 */
export async function getSensorClients(environment, clickupToken) {
  let baseUrl = ''
  let braveApiKey = ''
  if (environment === Environments.dev.name) {
    baseUrl = SENSOR_DEV_URL
    braveApiKey = BRAVE_API_KEY_DEV
  } else if (environment === Environments.prod.name) {
    baseUrl = SENSOR_PROD_URL
    braveApiKey = BRAVE_API_KEY_PROD
  } else if (environment === Environments.staging.name) {
    baseUrl = SENSOR_STAGING_URL
    braveApiKey = BRAVE_API_KEY_STAGING
  } else {
    return []
  }

  const data = {
    clickupToken,
    braveKey: braveApiKey,
  }

  try {
    const response = await axios.post(`${baseUrl}/pa/get-sensor-clients`, data)
    const resultArray = []
    response.data.clients.forEach(client => resultArray.push(client))
    return resultArray
  } catch (err) {
    return []
  }
}

export async function getSensor(sensorId, environment, clickupToken) {
  // TODO get the URL and API key for the given environment

  // TODO replace this function call with one that gets the sensors instead. For now, this was just to show that the Spinner works
  await getSensorClients(environment, clickupToken)

  // TODO call real API
  let toReturn = null
  if (sensorId === 'myid1') {
    toReturn = {
      locationid: 'myid1',
      displayName: 'Sensor 1 (FSM)',
      movementThreshold: '60',
      durationTimer: '900',
      stillnessTimer: '60',
      doorCoreId: 'AC2348838747324',
      radarCoreId: 'AC2348838747324',
      phoneNumber: '+12223334444',
      initialTimer: '5',
      isActive: true,
      firmwareStateMachine: true,
      doorId: '7A239C',
      clientId: 'clientId1',
      clients: [
        { id: 'clientId1', displayName: 'client1' },
        { id: 'clientId2', displayName: 'client2' },
      ],
    }
  } else if (sensorId === 'myid2') {
    toReturn = {
      locationid: 'myid2',
      displayName: 'Sensor 2 (SSM)',
      movementThreshold: '60',
      durationTimer: '900',
      stillnessTimer: '60',
      doorCoreId: 'AC2348838747324',
      radarCoreId: 'AC2348838747324',
      phoneNumber: '+12223334444',
      initialTimer: '5',
      isActive: false,
      firmwareStateMachine: false,
      doorId: '123456',
      clientId: 'clientId2',
      clients: [
        { id: 'clientId1', displayName: 'client1' },
        { id: 'clientId2', displayName: 'client2' },
      ],
    }
  }

  return toReturn
}

/**
 * insertSensorLocation: inserts a location into the brave sensor DB
 * @param {string} clickupToken       clickup token
 * @param {string} password           front-end database password
 * @param {string} locationID         new locationID for the DB
 * @param {string} displayName        display name on dashboard
 * @param {string} particleDeviceID   Particle deviceID of location's sensor
 * @param {string} twilioNumber       Twilio number for the location
 * @param {boolean} stateMachineBool  whether the location uses a state machine or not
 * @param {string} clientID           Unique clientID for location
 * @param {string} environment        which server to insert a sensor location to.
 * @return {Promise<boolean>}         true if successful, false if not
 */
export async function insertSensorLocation(
  clickupToken,
  password,
  locationID,
  displayName,
  particleDeviceID,
  twilioNumber,
  stateMachineBool,
  clientID,
  environment,
) {
  let baseUrl = ''
  let braveApiKey = ''
  if (environment === Environments.dev.name) {
    baseUrl = SENSOR_DEV_URL
    braveApiKey = BRAVE_API_KEY_DEV
  } else if (environment === Environments.prod.name) {
    baseUrl = SENSOR_PROD_URL
    braveApiKey = BRAVE_API_KEY_PROD
  } else if (environment === Environments.staging.name) {
    baseUrl = SENSOR_STAGING_URL
    braveApiKey = BRAVE_API_KEY_STAGING
  } else {
    return false
  }

  const data = {
    clickupToken,
    braveKey: braveApiKey,
    password,
    locationID,
    displayName,
    particleDeviceID,
    twilioNumber,
    stateMachineBool,
    clientID,
  }

  try {
    const response = await axios.post(`${baseUrl}/pa/create-sensor-location`, data)
    return response.data.message === 'success'
  } catch (err) {
    console.error(err)
    return false
  }
}
