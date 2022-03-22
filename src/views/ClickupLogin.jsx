import Button from 'react-bootstrap/Button'
import React, { useEffect, useState } from 'react'
import { getClickupToken } from '../utilities/StorageFunctions'
import { getClickupAccessToken, getClickupUserName } from '../utilities/ClickupFunctions'

function ClickupLogin() {
  const urlParams = new URLSearchParams(window.location.search)
  const clickupCode = urlParams.get('code')

  const [token, setToken] = useState('')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    async function effectHandler() {
      if (clickupCode !== null && token === '') {
        const clickupToken = await getClickupAccessToken(clickupCode)
        console.log('token: ', clickupToken)
        setToken(clickupToken)
        const username = await getClickupUserName(token)
        setUserName(username)
      }
    }
    effectHandler()
  })

  if (getClickupToken() === '' || getClickupToken() === null) {
    return (
      <Button
        href={`https://app.clickup.com/api?client_id=${process.env.REACT_APP_CLICKUP_CLIENT_ID}&redirect_uri=https://particle-accelerator-w93d4.ondigitalocean.app/clickup`}
      >
        Log in to ClickUp
      </Button>
    )
  }
  if (token !== '') {
    return <h1>Logged In as {userName}</h1>
  }
}

export default ClickupLogin
