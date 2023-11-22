import Button from 'react-bootstrap/Button'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getClickupAccessToken, getClickupUserName } from '../utilities/ClickupFunctions'

function ClickupLogin(props) {
  const { clickupToken, changeClickupToken, clickupUserName, changeClickupUserName } = props

  // Fetch OAuth code from redirect URL
  const urlParams = new URLSearchParams(window.location.search)
  const clickupCode = urlParams.get('code')
  const [performingTokenLogin, setPerformingTokenLogin] = useState(false)

  useEffect(() => {
    // Declare async function since top-level awaits don't exist yet.
    async function tokenLogin() {
      // temps avoid conflict with other variables.
      const tempClickupToken = await getClickupAccessToken(clickupCode)
      changeClickupToken(tempClickupToken)
      const tempUserName = await getClickupUserName(tempClickupToken)
      changeClickupUserName(tempUserName)
      setPerformingTokenLogin(false) // no longer performing token login
    }
    // Only call the fetch token when no tokens are present and there is a code in the current url.
    if (clickupCode !== null && clickupToken === '' && !performingTokenLogin) {
      setPerformingTokenLogin(true) // we only want to run tokenLogin once
      tokenLogin()
    }
  })

  if (clickupToken !== '') {
    return (
      <div style={{ padding: 20 }}>
        <h1>Logged in as: {clickupUserName}</h1>
        <div>
          <Button
            variant="danger"
            onClick={() => {
              changeClickupToken('')
              window.location.href = '/clickup'
            }}
          >
            Log Out of Clickup
          </Button>
        </div>
      </div>
    )
  }

  if (clickupToken === '') {
    return (
      <div style={{ padding: 20 }}>
        <Button
          href={`https://app.clickup.com/api?client_id=${process.env.REACT_APP_CLICKUP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_DOMAIN}/clickup`}
        >
          Log in to ClickUp
        </Button>
      </div>
    )
  }
}

ClickupLogin.propTypes = {
  clickupToken: PropTypes.string.isRequired,
  changeClickupToken: PropTypes.func.isRequired,
  clickupUserName: PropTypes.string.isRequired,
  changeClickupUserName: PropTypes.func.isRequired,
}

export default ClickupLogin
