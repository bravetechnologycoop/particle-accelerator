const accountSID = process.env.REACT_APP_TWILIO_SID
const twilioToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN
const messagingWebhook = process.env.REACT_APP_TWILIO_BRAVE_WEBHOOK_URL
const allSensorMessagesSID = process.env.REACT_APP_TWILIO_ALL_SENSOR_MESSAGES_SID

const twilioClient = require('twilio')(accountSID, twilioToken)

export async function getTwilioNumbersByLocality(countryCode, cityName, searchLength) {
  try {
    const response = await twilioClient.availablePhoneNumbers(countryCode).local.list({ inLocality: cityName, limit: searchLength })
    if (response.length === 0) {
      console.log(`No numbers found for the locality: ${cityName}`)
      return []
    }
    const numberList = response
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

export async function getTwilioNumbersByAreaCode(countryCode, areaCode, searchLength) {
  try {
    const response = await twilioClient.availablePhoneNumbers(countryCode).local.list({ areaCode, limit: searchLength })
    if (response.length === 0) {
      console.log(`No numbers found for the area code: ${areaCode}`)
      return null
    }
    const numberList = response
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
  try {
    const phoneNumberResponse = await twilioClient.incomingPhoneNumbers.create({
      phoneNumber,
      smsUrl: messagingWebhook,
      voiceUrl: 'https://demo.twilio.com/welcome/voice/',
      friendlyName: locationID,
      smsMethod: 'POST',
    })
    try {
      await twilioClient.messaging.services(allSensorMessagesSID).phoneNumbers.create({ phoneNumberSid: phoneNumberResponse.sid })
      return true
    } catch (err) {
      console.error('TwilioFunctions: Error in adding number to All Sensor Messages', err)
      return false
    }
  } catch (err) {
    console.error('TwilioFunctions: Error in purchasing number', err)
    return false
  }
}

export async function purchaseTwilioNumberByLocality(countryCode, cityName, locationID) {
  const twilioNumbers = getTwilioNumbersByLocality(countryCode, cityName, 1)
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
