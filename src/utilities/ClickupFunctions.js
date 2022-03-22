const axios = require('axios')

// eslint-disable-next-line import/prefer-default-export
export async function getClickupAccessToken(code) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/oauth/token?client_id=${process.env.REACT_APP_CLICKUP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLICKUP_CLIENT_SECRET}&code=${code}`

  try {
    console.log(`POST to ${url}`)
    const response = await axios.post(url)
    console.log(response.data.access_token)
    return response.data.access_token
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getClickupUserName(token) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/user`

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(response)
    return response.data.user.username
  } catch (err) {
    console.error(err)
    return ''
  }
}

export async function getClickupWorkspaces(token) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/team`

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(response)
  } catch (err) {
    console.error(err)
    return []
  }
}
