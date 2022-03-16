import { Badge } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'

/**
 * LoginStatus: React component for displaying the current login state of the
 * application. Outputs a badge based on the value of the loginState context
 * hook.
 */
function LoginStatus(props) {
  const { loginState, userName } = props

  if (loginState === 'waiting') {
    return (
      <div>
        <Badge bg="warning">Authentication in Progress</Badge>
      </div>
    )
  }
  if (loginState === 'passwordincorrect') {
    return (
      <div>
        <Badge bg="danger">Authentication Error</Badge>
      </div>
    )
  }
  if (loginState === 'true') {
    return (
      <div>
        <Badge bg="success">{userName}</Badge>
      </div>
    )
  }
  return (
    <div>
      <Badge bg="danger">Not Authenticated</Badge>
    </div>
  )
}

LoginStatus.propTypes = {
  loginState: PropTypes.string,
  userName: PropTypes.string,
}

LoginStatus.defaultProps = {
  loginState: '',
  userName: '',
}

export default LoginStatus
