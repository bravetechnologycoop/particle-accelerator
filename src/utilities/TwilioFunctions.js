const axios = require('axios')

const accountSID = process.env.REACT_APP_TWILIO_SID
const twilioToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN
const messagingWebhook = process.env.REACT_APP_TWILIO_BRAVE_WEBHOOK_URL
const allSensorMessagesSID = process.env.REACT_APP_TWILIO_ALL_SENSOR_MESSAGES_SID

export async function getTwilioNumbersByAreaCode(countryCode, areaCode, searchLength) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSID}/AvailablePhoneNumbers/${countryCode}/Local.json?AreaCode=#${areaCode}&PageSize=${searchLength}`

  try {
    const response = await axios.get(url, {
      auth: { username: accountSID, password: twilioToken },
    })

    if (response.data.length === 0) {
      console.log(`No numbers found for the area code: ${areaCode}`)
      return null
    }
    const numberList = response.data
      .filter(number => {
        return number.capabilities.voice
      })
      .map(number => {
        return { readableName: number.friendlyName, phoneNumber: number.phoneNumber, locality: number.locality }
      })
    return numberList
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function purchaseTwilioNumber(phoneNumber, locationID) {
  const registerPhoneNumberURL = `https://api.twilio.com/2010-04-01/Accounts/${accountSID}/IncomingPhoneNumbers.json`

  const registerPhoneNumberData = {
    phoneNumber,
    smsUrl: messagingWebhook,
    voiceUrl: 'https://demo.twilio.com/welcome/voice/',
    friendlyName: locationID,
    smsMethod: 'POST',
  }

  const authConfig = {
    auth: {
      username: accountSID,
      password: twilioToken,
    },
  }

  try {
    const phoneNumberResponse = (await axios.post(registerPhoneNumberURL, registerPhoneNumberData, authConfig)).data

    const messagingServiceURL = `https://messaging.twilio.com/v1/Services/${allSensorMessagesSID}/PhoneNumbers`
    const messagingServiceData = { PhoneNumberSid: phoneNumberResponse.sid }

    try {
      const messagingServiceResponse = await axios.post(messagingServiceURL, messagingServiceData, authConfig)
      return messagingServiceResponse.status === 200
    } catch (err) {
      console.error('TwilioFunctions: Error in adding number to All Sensor Messages', err)
      return false
    }
  } catch (err) {
    console.error('TwilioFunctions: Error in purchasing number', err)
    return false
  }
}

export async function purchaseTwilioNumberByAreaCode(countryCode, areaCode, locationID) {
  const twilioNumbers = getTwilioNumbersByAreaCode(countryCode, areaCode, 1)
  if (twilioNumbers !== null) {
    const twilioNumber = twilioNumbers[0].phoneNumber
    const twilioNumberRegistration = await purchaseTwilioNumber(twilioNumber, locationID)
    if (twilioNumberRegistration) {
      return { phoneNumber: twilioNumber, readableNumber: twilioNumbers[0].friendlyName }
    }
    return null
  }
  return null
}
