const axios = require('axios')

// eslint-disable-next-line import/prefer-default-export
export async function getClickupAccessToken(code) {
  const headers = {
    Origin: 'https://api.clickup.com',
  }

  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/oauth/token?client_id=${process.env.REACT_APP_CLICKUP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLICKUP_CLIENT_SECRET}&code=${code}`

  try {
    console.log(`POST to ${url}`)
    const response = await axios.post(url, headers)
    console.log(response)
  } catch (err) {
    console.log(err)
  }
}
