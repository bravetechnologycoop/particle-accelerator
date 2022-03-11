import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const { getDisplayName } = require('../utilities/ParticleFunctions')

/**
 * WelcomeText: React Component for displaying the user's name or company name.
 */
function WelcomeText(props) {
  const { token } = props

  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    async function fetchUserInfo() {
      const response = await getDisplayName(token)
      setDisplayName(response)
    }
    fetchUserInfo()
  }, [token])

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{displayName}</>
}

WelcomeText.propTypes = {
  token: PropTypes.string,
}

WelcomeText.defaultProps = {
  token: '',
}

export default WelcomeText
