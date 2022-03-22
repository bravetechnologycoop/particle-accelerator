import Button from 'react-bootstrap/Button'
import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { getClickupAccessToken, getClickupUserName } from '../utilities/ClickupFunctions'

function ClickupLogin(props) {
  const { clickupToken, changeClickupToken, clickupUserName, changeClickupUserName, clickupListID, changeClickupListID } = props

  const urlParams = new URLSearchParams(window.location.search)
  const clickupCode = urlParams.get('code')

  useEffect(() => {
    async function effectHandler() {
      const tempClickupToken = await getClickupAccessToken(clickupCode)
      console.log('token: ', tempClickupToken)
      changeClickupToken(tempClickupToken)
      const tempUserName = await getClickupUserName(tempClickupToken)
      changeClickupUserName(tempUserName)
      console.log('username: ', tempUserName)
    }
    if (clickupCode !== null && clickupToken === '') {
      effectHandler()
    }
  })

  if (clickupToken !== '') {
    return (
      <>
        <h1>Logged In as {clickupUserName}</h1>
        <Card>
          <Card.Title>Set Clickup Configuration</Card.Title>
        </Card>
      </>
    )
  }

  if (clickupToken === '') {
    return (
      <Button
        href={`https://app.clickup.com/api?client_id=${process.env.REACT_APP_CLICKUP_CLIENT_ID}&redirect_uri=https://particle-accelerator-w93d4.ondigitalocean.app/clickup`}
      >
        Log in to ClickUp
      </Button>
    )
  }
}

ClickupLogin.propTypes = {
  clickupToken: PropTypes.string,
  changeClickupToken: PropTypes.func,
  clickupUserName: PropTypes.string,
  changeClickupUserName: PropTypes.func,
  clickupListID: PropTypes.string,
  changeClickupListID: PropTypes.func,
}

ClickupLogin.defaultProps = {
  clickupToken: '',
  changeClickupToken: () => {},
  clickupUserName: '',
  changeClickupUserName: () => {},
  clickupListID: '',
  changeClickupListID: () => {},
}

export default ClickupLogin
