import { Environments } from './Constants'

const axios = require('axios')

const BUTTONS_DEV_URL = process.env.REACT_APP_BUTTONS_DEV_URL
const BUTTONS_PROD_URL = process.env.REACT_APP_BUTTONS_PROD_URL
const BUTTONS_STAGING_URL = process.env.REACT_APP_BUTTONS_STAGING_URL

const SENSOR_DEV_URL = process.env.REACT_APP_SENSOR_DEV_URL
const SENSOR_PROD_URL = process.env.REACT_APP_SENSOR_PROD_URL
const SENSOR_STAGING_URL = process.env.REACT_APP_SENSOR_STAGING_URL

const braveAPIKey = process.env.REACT_APP_BRAVE_API_KEY

/**
 * purchaseTwilioNumberByAreaCode: helper function for purchaseSensorTwilioNumberByAreaCode and purchaseButtonTwilioNumberByAreaCode.
 * purchases a twilio number using the Brave backend as a middle person.
 * @param {string} url      the endpoint to contact for the http request
 * @param {string} areaCode          the area code to purchase a phone number in
 * @param {string} locationID        the friendly name to assign to the phone number
 * @param {string} clickupToken      clickup auth token
 * @return {Promise<{phoneNumber: string, friendlyName: string}|string>} a phone number object if successful, error message if unsuccessful
 */
async function purchaseTwilioNumberByAreaCode(url, areaCode, locationID, clickupToken) {
  const data = {
    areaCode,
    locationID,
    clickupToken,
    braveKey: braveAPIKey,
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
export async function purchaseSensorTwilioNumberByAreaCode(areaCode, locationID, environment, clickupToken) {
  if (environment === Environments.dev.name) {
    return purchaseTwilioNumberByAreaCode(`${SENSOR_DEV_URL}/pa/sensor-twilio-number`, areaCode, locationID, clickupToken)
  }
  if (environment === Environments.prod.name) {
    return purchaseTwilioNumberByAreaCode(`${SENSOR_PROD_URL}/pa/sensor-twilio-number`, areaCode, locationID, clickupToken)
  }
  if (environment === Environments.staging.name) {
    return purchaseTwilioNumberByAreaCode(`${SENSOR_STAGING_URL}/pa/sensor-twilio-number`, areaCode, locationID, clickupToken)
  }
  return 'Error: No environment found'
}

/**
 * **purchaseButtonTwilioNumberByAreaCode**: purchases a twilio number with production configurations for a button
 * @param {string} areaCode      the area code to purchase a phone number in
 * @param {string} locationID    the friendly name for the twilio number
 * @param {string} environment   the phase of deployment to add the twilio number to
 * @param {string} clickupToken  clickup auth token
 * @return {Promise<{phoneNumber: string, friendlyName: string}|string>} a phone number object if successful, error message if unsuccessful
 */
export async function purchaseButtonTwilioNumberByAreaCode(areaCode, locationID, environment, clickupToken) {
  if (environment === Environments.dev.name) {
    return purchaseTwilioNumberByAreaCode(`${BUTTONS_DEV_URL}/pa/buttons-twilio-number`, areaCode, locationID, clickupToken)
  }
  if (environment === Environments.prod.name) {
    return purchaseTwilioNumberByAreaCode(`${BUTTONS_PROD_URL}/pa/buttons-twilio-number`, areaCode, locationID, clickupToken)
  }
  if (environment === Environments.staging.name) {
    return purchaseTwilioNumberByAreaCode(`${BUTTONS_STAGING_URL}/pa/buttons-twilio-number`, areaCode, locationID, clickupToken)
  }
  return 'Error: No environment found'
}
