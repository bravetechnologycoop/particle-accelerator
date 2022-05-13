import { Environments } from './Constants'

const axios = require('axios')

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
  const data = {
    clickupToken,
    braveKey: process.env.REACT_APP_BRAVE_API_KEY,
  }

  let baseUrl = ''
  if (environment === Environments.dev.name) {
    baseUrl = SENSOR_DEV_URL
  } else if (environment === Environments.prod.name) {
    baseUrl = SENSOR_PROD_URL
  } else if (environment === Environments.staging.name) {
    baseUrl = SENSOR_STAGING_URL
  } else {
    return []
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
  const data = {
    clickupToken,
    braveKey: process.env.REACT_APP_BRAVE_API_KEY,
    password,
    locationID,
    displayName,
    particleDeviceID,
    twilioNumber,
    stateMachineBool,
    clientID,
    radarType,
  }

  let baseUrl = ''
  if (environment === Environments.dev.name) {
    baseUrl = SENSOR_DEV_URL
  } else if (environment === Environments.prod.name) {
    baseUrl = SENSOR_PROD_URL
  } else if (environment === Environments.staging.name) {
    baseUrl = SENSOR_STAGING_URL
  } else {
    return false
  }

  try {
    const response = await axios.post(`${baseUrl}/pa/create-sensor-location`, data)
    return response.data.message === 'success'
  } catch (err) {
    console.error(err)
    return false
  }
}
