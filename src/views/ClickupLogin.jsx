import Button from 'react-bootstrap/Button'
import React, { useEffect } from 'react'
import { getClickupToken } from '../utilities/StorageFunctions'
import getClickupAccessToken from '../utilities/ClickupFunctions'

function ClickupLogin() {
  const urlParams = new URLSearchParams(window.location.search)
  const clickupCode = urlParams.get('code')

  useEffect(() => {
    if (clickupCode !== null) {
      getClickupAccessToken(clickupCode)
    }
  })

  function buttonHandler(evt) {
    evt.preventDefault()
    if (clickupCode !== null) {
      getClickupAccessToken(clickupCode)
    }
  }

  if (getClickupToken() === '' || getClickupToken() === null) {
    return (
      <>
        <Button href={`https://app.clickup.com/api?client_id=${process.env.CLICKUP_CLIENT_ID}&redirect_uri=https://particle-accelerator-w93d4.ondigitalocean.app/clickup`}>Log in to ClickUp</Button>
        <Button onClick={buttonHandler}>Get token</Button>
      </>
    )
  }
  if (getClickupToken() !== '') {
    return <h1>Logged In!</h1>
  }
}

export default ClickupLogin
