import axios from 'axios'

import { Environments } from './Constants'

const BRAVE_API_KEY_DEV = process.env.REACT_APP_BRAVE_API_KEY_DEV
const BRAVE_API_KEY_STAGING = process.env.REACT_APP_BRAVE_API_KEY_STAGING
const BRAVE_API_KEY_PROD = process.env.REACT_APP_BRAVE_API_KEY_PROD

const SENSOR_DEV_URL = process.env.REACT_APP_SENSOR_DEV_URL
const SENSOR_PROD_URL = process.env.REACT_APP_SENSOR_PROD_URL
const SENSOR_STAGING_URL = process.env.REACT_APP_SENSOR_STAGING_URL

/**
 * getSensorClients: retrieves the list of clients in the Brave sensor DB, uses the sensors backend.
 * @param {string} environment       which server to retrieve clients from
 * @param {string} googleIdToken     Google ID token
 * @return {Promise<{name: string, id: string}[]>}   array of client names and ids if successful, empty if not.
 */
export async function getSensorClients(environment, googleIdToken) {
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
    googleIdToken,
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
 * getClientDevices: gets all devices linked to a client
 * @param {string} environment       which server to retrieve clients from
 * @param {string} googleIdToken     Google ID token
 * @param {string} displayName       name of client
 * @return {Promise<{name: string, id: string}[]>}   array of all devices if successful, empty if not.
 */
export async function getClientDevices(displayName, environment, googleIdToken) {
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
    googleIdToken,
    braveKey: braveApiKey,
    displayName,
  }

  try {
    const response = await axios.post(`${baseUrl}/pa/get-client-devices`, data)
    const resultArray = []
    response.data.clients.forEach(client => resultArray.push(client))
    return resultArray
  } catch (err) {
    return []
  }
}

/**
 * insertSensorLocation: inserts a location into the brave sensor DB
 * @param {string} googleIdToken      Google ID token
 * @param {string} password           front-end database password
 * @param {string} locationID         new locationID for the DB
 * @param {string} displayName        display name on dashboard
 * @param {string} particleDeviceID   Particle deviceID of location's sensor
 * @param {string} twilioNumber       Twilio number for the location
 * @param {string} clientID           Unique clientID for location
 * @param {string} environment        which server to insert a sensor location to.
 * @return {Promise<boolean>}         true if successful, false if not
 */
export async function insertSensorLocation(
  googleIdToken,
  password,
  locationID,
  displayName,
  particleDeviceID,
  twilioNumber,
  clientID,
  deviceType,
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
    googleIdToken,
    braveKey: braveApiKey,
    password,
    locationID,
    displayName,
    deviceType,
    particleDeviceID,
    twilioNumber,
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
