const accountSID = process.env.REACT_APP_TWILIO_SID
const twilioToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN

const twilioClient = require('twilio')(accountSID, twilioToken)

export async function getTwilioNumbersInLocale(countryCode, areaCode) {
  const response = await twilioClient.availablePhoneNumbers(countryCode)
}