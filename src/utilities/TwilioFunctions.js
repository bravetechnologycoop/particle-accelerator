const axios = require('axios')

const BUTTONS_DEV_URL = process.env.REACT_APP_BUTTONS_DEV_URL
const SENSOR_DEV_URL = process.env.REACT_APP_SENSOR_DEV_URL
const braveAPIKey = process.env.REACT_APP_BRAVE_API_KEY

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

export async function purchaseSensorTwilioNumberByAreaCode(areaCode, locationID, clickupToken) {
  return purchaseTwilioNumberByAreaCode(`${SENSOR_DEV_URL}/pa/sensor-twilio-number`, areaCode, locationID, clickupToken)
}

export async function purchaseButtonTwilioNumberByAreaCode(areaCode, locationID, clickupToken) {
  return purchaseTwilioNumberByAreaCode(`${BUTTONS_DEV_URL}/pa/buttons-twilio-number`, areaCode, locationID, clickupToken)
}
