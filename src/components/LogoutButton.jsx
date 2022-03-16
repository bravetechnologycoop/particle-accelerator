import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import React from 'react'

/**
 * LogoutButton: React component (button) for resetting the token and loginState
 * to default/null values.
 * @effects the global token variable and the global loginState variable
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
  token: PropTypes.string,
  changeToken: PropTypes.func,
  changeLoginState: PropTypes.func,
  changeParticleSettings: PropTypes.func,
}

LogoutButton.defaultProps = {
  token: '',
  changeToken: () => {},
  changeLoginState: () => {},
  changeParticleSettings: () => {},
}

export default LogoutButton
