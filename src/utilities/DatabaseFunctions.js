const axios = require('axios')

// eslint-disable-next-line import/prefer-default-export
export async function getSensorClients(clickupToken) {
  const data = {
    clickupToken,
    braveKey: process.env.REACT_APP_BRAVE_API_KEY,
  }

  try {
    const response = await axios.post('https://chatbot-dev.brave.coop/get-sensor-clients', data)
    const resultArray = []
    response.data.clients.forEach(client => resultArray.push(client))
    return resultArray
  } catch (err) {
    return []
  }
}
