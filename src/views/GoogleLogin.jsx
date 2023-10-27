import PropTypes from 'prop-types'
import React from 'react'
import Button from 'react-bootstrap/Button'
import { useCookies } from 'react-cookie'
import LoginStatus from '../components/general/LoginStatus'

function GoogleLogin(props) {
  const { googlePayload } = props
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(['googleIDToken'])

  return (
    <div style={{ width: '25ch', padding: 20 }}>
      <h2>Google Login</h2>
      <h4>
        <LoginStatus loginState="true" userName={`${googlePayload.name} (${googlePayload.email})`} />
      </h4>
      <Button
        variant="danger"
        onClick={() => {
          removeCookie('googleIDToken')
          window.location.reload()
        }}
      >
        Logout
      </Button>
    </div>
  )
}

GoogleLogin.propTypes = {
  googlePayload: PropTypes.shape({
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
}

export default GoogleLogin
