const axios = require('axios')

const CHATBOT_DEV_ENDPOINT = process.env.REACT_APP_CHATBOT_DEV_URL

// eslint-disable-next-line import/prefer-default-export
export async function getSensorClients(clickupToken) {
  const data = {
    clickupToken,
    braveKey: process.env.REACT_APP_BRAVE_API_KEY,
  }

  try {
    const response = await axios.post(`${CHATBOT_DEV_ENDPOINT}/get-sensor-clients`, data)
    const resultArray = []
    response.data.clients.forEach(client => resultArray.push(client))
    return resultArray
  } catch (err) {
    return []
  }
}

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
    const response = await axios.post(`${CHATBOT_DEV_ENDPOINT}/create-sensor-location`, data)
    return response.data.message === 'success'
  } catch (err) {
    console.error(err)
    return false
  }
}
