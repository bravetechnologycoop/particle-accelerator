import axios from 'axios'

const BUTTONS_DEV_URL = process.env.REACT_APP_BUTTONS_DEV_URL
const braveAPIKey = process.env.REACT_APP_BRAVE_API_KEY

// eslint-disable-next-line import/prefer-default-export
export async function registerLoraButton(deviceEUI, targetName, clickupToken) {
  const url = `${BUTTONS_DEV_URL}/pa/aws-device-registration`

  const data = {
    deviceEUI,
    targetName,
    clickupToken,
    braveKey: braveAPIKey,
  }

  try {
    await axios.post(url, data)
    return 'success'
  } catch (err) {
    console.error(err)
    return err.response.data
  }
}
