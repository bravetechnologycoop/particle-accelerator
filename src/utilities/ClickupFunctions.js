const axios = require('axios')

export default async function getClickupAccessToken(code) {
  try {
    const response = await axios.post(
      `https://api.clickup.com/api/v2/oauth/token?client_id=${process.env.CLICKUP_CLIENT_ID}&client_secret=${process.env.CLICKUP_CLIENT_SECRET}&code=${code}`,
    )
    console.log(response)
  } catch (err) {
    console.error(err)
  }
}
