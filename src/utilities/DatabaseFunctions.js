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
 * @param {string} radarType          Innosent or XeThru radar type ('innosent' or 'xethru')
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
  radarType,
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
    radarType,
  }

  try {
    const response = await axios.post(`${baseUrl}/pa/create-sensor-location`, data)
    return response.data.message === 'success'
  } catch (err) {
    console.error(err)
    return false
  }
}
