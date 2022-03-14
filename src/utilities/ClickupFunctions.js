const axios = require('axios')

// eslint-disable-next-line import/prefer-default-export
export async function getClickupAccessToken(code) {
  const url = `https://api.clickup.com/api/v2/oauth/token?client_id=${process.env.REACT_APP_CLICKUP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLICKUP_CLIENT_ID}&code=${code}`

  const headers = {
    'Content-Type': 'application/json',
  }

  try {
    const response = await axios.post(url, headers)
    console.log(response)
  } catch (err) {
    console.log(err)
  }
}
