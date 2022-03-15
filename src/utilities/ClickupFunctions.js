const axios = require('axios')

// eslint-disable-next-line import/prefer-default-export
export async function getClickupAccessToken(code) {
  const url = `/api/v2/oauth/token?client_id=${process.env.REACT_APP_CLICKUP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLICKUP_CLIENT_ID}&code=${code}`

  try {
    const response = await axios.post(url)
    console.log(response)
  } catch (err) {
    console.log(err)
  }
}
