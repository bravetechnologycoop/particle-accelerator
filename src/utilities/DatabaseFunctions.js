const axios = require('axios')

const SENSOR_DEV_URL = process.env.REACT_APP_SENSOR_DEV_URL

/**
 * getSensorClients: retrieves the list of clients in the Brave sensor DB, uses the sensors backend.
 * @param clickupToken      clickup token
 * @return {Promise<{name: string, id: string}[]>}   array of client names and ids if successful, empty if not.
 */
export async function getSensorClients(clickupToken) {
  const data = {
    clickupToken,
    braveKey: process.env.REACT_APP_BRAVE_API_KEY,
  }

  try {
    const response = await axios.post(`${SENSOR_DEV_URL}/pa/get-sensor-clients`, data)
    const resultArray = []
    response.data.clients.forEach(client => resultArray.push(client))
    return resultArray
  } catch (err) {
    return []
  }
}

/**
 *
 * @param clickupToken
 * @param password
 * @param locationID
 * @param displayName
 * @param particleDeviceID
 * @param twilioNumber
 * @param stateMachineBool
 * @param clientID
 * @param radarType
 * @return {Promise<boolean>}
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

  try {
    const response = await axios.post(`${SENSOR_DEV_URL}/pa/create-sensor-location`, data)
    return response.data.message === 'success'
  } catch (err) {
    console.error(err)
    return false
  }
}
