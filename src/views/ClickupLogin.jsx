import Button from 'react-bootstrap/Button'
import React, { useEffect, useState } from 'react'
import { getClickupToken } from '../utilities/StorageFunctions'
import { getClickupAccessToken, getClickupUserName } from '../utilities/ClickupFunctions'

function ClickupLogin() {
  const urlParams = new URLSearchParams(window.location.search)
  const clickupCode = urlParams.get('code')

  const [token, setToken] = useState('')

  useEffect(() => {
    async function effectHandler() {
      if (clickupCode !== null && token !== '') {
        const clickupToken = await getClickupAccessToken(clickupCode)
        console.log('token: ', clickupToken)
        setToken(clickupToken)
      }
    }
    effectHandler()
  })

  function buttonHandler(evt) {
    evt.preventDefault()
    if (clickupCode !== null) {
      getClickupUserName(token)
    }
  }

  if (getClickupToken() === '' || getClickupToken() === null) {
    return (
      <>
        <Button
          href={`https://app.clickup.com/api?client_id=${process.env.REACT_APP_CLICKUP_CLIENT_ID}&redirect_uri=https://particle-accelerator-w93d4.ondigitalocean.app/clickup`}
        >
          Log in to ClickUp
        </Button>
        <Button onClick={buttonHandler}>Get token</Button>
      </>
    )
  }
  if (getClickupToken() !== '') {
    return <h1>Logged In!</h1>
  }
}

export default ClickupLogin
