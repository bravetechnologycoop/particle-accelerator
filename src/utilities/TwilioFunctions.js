const axios = require('axios')

const accountSID = process.env.REACT_APP_TWILIO_SID
const twilioToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN
const messagingWebhook = process.env.REACT_APP_TWILIO_BRAVE_WEBHOOK_URL
const allSensorMessagesSID = process.env.REACT_APP_TWILIO_ALL_SENSOR_MESSAGES_SID

const chatbotDevURL = process.env.REACT_APP_CHATBOT_DEV_URL
const braveAPIKey = process.env.REACT_APP_BRAVE_API_KEY

export async function purchaseSensorTwilioNumberByAreaCode(areaCode, locationID, clickupToken) {
  const url = `${chatbotDevURL}/sensor-twilio-number`

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

export async function purchaseButtonTwilioNumberByAreaCode(areaCode, locationID, clickupToken) {
  const url = `${chatbotDevURL}/button-twilio-number`

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
