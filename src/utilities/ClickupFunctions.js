const axios = require('axios')

export default async function getClickupAccessToken(code) {
  const url = `https://api.clickup.com/api/v2/oauth/token?`
  try {
    const response = await axios.post(url, {
      client_id: process.env.REACT_APP_CLICKUP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLICKUP_CLIENT_ID,
      code,
    })
    console.log(response)
  } catch (err) {
    console.log(err)
  }
}
