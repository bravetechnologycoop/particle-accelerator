import { Environments } from './Constants'

const axios = require('axios')

const BUTTONS_DEV_URL = process.env.REACT_APP_BUTTONS_DEV_URL
const BUTTONS_PROD_URL = process.env.REACT_APP_BUTTONS_PROD_URL
const BUTTONS_STAGING_URL = process.env.REACT_APP_BUTTONS_STAGING_URL

const SENSOR_DEV_URL = process.env.REACT_APP_SENSOR_DEV_URL
const SENSOR_PROD_URL = process.env.REACT_APP_SENSOR_PROD_URL
const SENSOR_STAGING_URL = process.env.REACT_APP_SENSOR_STAGING_URL

const BRAVE_API_KEY_DEV = process.env.REACT_APP_BRAVE_API_KEY_DEV
const BRAVE_API_KEY_STAGING = process.env.REACT_APP_BRAVE_API_KEY_STAGING
const BRAVE_API_KEY_PROD = process.env.REACT_APP_BRAVE_API_KEY_PROD

/**
 * purchaseTwilioNumberByAreaCode: helper function for purchaseSensorTwilioNumberByAreaCode and purchaseButtonTwilioNumberByAreaCode.
 * purchases a twilio number using the Brave backend as a middle person.
 * @param {string} url               the endpoint to contact for the http request
 * @param {string} areaCode          the area code to purchase a phone number in
 * @param {string} locationID        the friendly name to assign to the phone number
 * @param {string} environment       the phase of deployment to add the twilio number to
 * @param {string} clickupToken      clickup auth token
 * @return {Promise<{phoneNumber: string, friendlyName: string}|string>} a phone number object if successful, error message if unsuccessful
 */
async function purchaseTwilioNumberByAreaCode(url, areaCode, locationID, environment, googleIdToken) {
  let braveApiKey = ''

  if (environment === Environments.dev.name) {
    braveApiKey = BRAVE_API_KEY_DEV
  } else if (environment === Environments.prod.name) {
    braveApiKey = BRAVE_API_KEY_PROD
  } else if (environment === Environments.staging.name) {
    braveApiKey = BRAVE_API_KEY_STAGING
  } else {
    return 'Error: No environment found'
  }

  const data = {
    areaCode,
    locationID,
    googleIdToken,
    braveKey: braveApiKey,
  }

  try {
    const response = await axios.post(url, data)
    return response.data
  } catch (err) {
    console.error(err)
    return err.response.data.message
  }
}

/**
 * **purchaseSensorTwilioNumberByAreaCode**: purchases a twilio number with production configurations for a sensor
 * @param {string} areaCode      the area code to purchase a phone number in
 * @param {string} locationID    the location ID of the sensor
 * @param {string} environment   the phase of deployment to add the twilio number to
 * @param {string} clickupToken  clickup auth token
 * @return {Promise<{phoneNumber: string, friendlyName: string}|string>} a phone number object if successful, error message if unsuccessful
 */
export async function purchaseSensorTwilioNumberByAreaCode(areaCode, locationID, environment, googleIdToken) {
  let baseUrl = ''
  if (environment === Environments.dev.name) {
    baseUrl = SENSOR_DEV_URL
  } else if (environment === Environments.prod.name) {
    baseUrl = SENSOR_PROD_URL
  } else if (environment === Environments.staging.name) {
    baseUrl = SENSOR_STAGING_URL
  } else {
    return 'Error: No environment found'
  }

  return purchaseTwilioNumberByAreaCode(`${baseUrl}/pa/sensor-twilio-number`, areaCode, locationID, environment, googleIdToken)
}

/**
 * **purchaseButtonTwilioNumberByAreaCode**: purchases a twilio number with production configurations for a button
 * @param {string} areaCode      the area code to purchase a phone number in
 * @param {string} locationID    the friendly name for the twilio number
 * @param {string} environment   the phase of deployment to add the twilio number to
 * @param {string} googleIdToken Google ID token
 * @return {Promise<{phoneNumber: string, friendlyName: string}|string>} a phone number object if successful, error message if unsuccessful
 */
export async function purchaseButtonTwilioNumberByAreaCode(areaCode, locationID, environment, googleIdToken) {
  let baseUrl = ''
  if (environment === Environments.dev.name) {
    baseUrl = BUTTONS_DEV_URL
  } else if (environment === Environments.prod.name) {
    baseUrl = BUTTONS_PROD_URL
  } else if (environment === Environments.staging.name) {
    baseUrl = BUTTONS_STAGING_URL
  } else {
    return 'Error: No environment found'
  }

  return purchaseTwilioNumberByAreaCode(`${baseUrl}/pa/buttons-twilio-number`, areaCode, locationID, environment, googleIdToken)
}
