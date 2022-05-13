import axios from 'axios'
import { Environments } from './Constants'

const braveAPIKey = process.env.REACT_APP_BRAVE_API_KEY
const BUTTONS_DEV_URL = process.env.REACT_APP_BUTTONS_DEV_URL
const BUTTONS_PROD_URL = process.env.REACT_APP_BUTTONS_PROD_URL
const BUTTONS_STAGING_URL = process.env.REACT_APP_BUTTONS_STAGING_URL

/**
 * registerLoraButton: Uses Brave's backend to register a lora button to Brave's AWS account.
 * @param {string} deviceEUI EUI of RAK 7201 button to register to AWS
 * @param {string} targetName Name for the device in AWS
 * @param {string} environment
 * @param {string} clickupToken Global clickup token for authentication
 * @return {Promise<string|*>} 'success' if successful, server error message if not.
 */
// eslint-disable-next-line import/prefer-default-export
export async function registerLoraButton(deviceEUI, targetName, environment, clickupToken) {
  const data = {
    deviceEUI,
    targetName,
    clickupToken,
    braveKey: braveAPIKey,
  }

  let baseUrl = ''

  if (environment === Environments.dev.name) {
    baseUrl = BUTTONS_DEV_URL
  } else if (environment === Environments.prod.name) {
    baseUrl = BUTTONS_PROD_URL
  } else if (environment === Environments.staging.name) {
    baseUrl = BUTTONS_STAGING_URL
  } else {
    return 'Error: no corresponding target found'
  }

  try {
    await axios.post(`${baseUrl}/pa/aws-device-registration`, data)
    return 'success'
  } catch (err) {
    console.error(err)
    return err.response.data
  }
}
