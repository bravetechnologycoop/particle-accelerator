import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import React from 'react'
import { changeParticleLoginState, changeParticleToken } from '../utilities/StorageFunctions'

/**
 * LogoutButton: React component (button) for resetting the token and loginState
 * to default/null values.
 * @effects the global token variable and the global loginState variable
 */
function LogoutButton(props) {
  const { token, changeToken, changeLoginState } = props

  const disabledStatus = token === ''

  return (
    <div>
      <Button
        variant="danger"
        onClick={() => {
          changeLoginState('false')
          changeToken('')
          changeParticleLoginState('false')
          changeParticleToken('')
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
}

LogoutButton.defaultProps = {
  token: '',
  changeToken: () => {},
  changeLoginState: () => {},
}

export default LogoutButton
