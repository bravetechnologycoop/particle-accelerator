const axios = require('axios')

export default async function getClickupAccessToken(code) {
  try {
    const response = await axios.post(
      `https://api.clickup.com/api/v2/oauth/token?client_id=CGMSSFGHWVSER0UKFOSXAJHBXJXNE3XS&client_secret=K1PMR5T7NHY55516RI7QYMRT5IY1E1AI7O3D8IF96UB8BKY75F9KFFPJP0X0DR4Q&code=${code}`,
    )
    console.log(response)
    return response
  } catch (err) {
    console.log(err)
    return ''
  }
}
