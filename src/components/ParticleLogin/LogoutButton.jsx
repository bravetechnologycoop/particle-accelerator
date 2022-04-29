import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import React from 'react'

/**
 * LogoutButton: React component that logs a user out of an Account
 *
 * @param {string} props.token The current access token for the account
 * @param {function} props.changeToken Handler function to change the access token value.
 * @param {function} props.changeLoginState Handler function to change the login state.
 * @param {function} props.changeLoginState Handler function to change the global ParticleSettings object
 * @return {JSX.Element}
 */
function LogoutButton(props) {
  const { token, changeToken, changeLoginState, changeParticleSettings } = props

  const disabledStatus = token === ''

  return (
    <div>
      <Button
        variant="danger"
        onClick={() => {
          changeLoginState('false')
          changeToken('')
          changeParticleSettings('clear', 'clear')
        }}
        disabled={disabledStatus}
        size="sm"
      >
        Logout
      </Button>
    </div>
  )
}

LogoutButton.propTypes = {
  token: PropTypes.string.isRequired,
  changeToken: PropTypes.func.isRequired,
  changeLoginState: PropTypes.func.isRequired,
  changeParticleSettings: PropTypes.func.isRequired,
}

export default LogoutButton
