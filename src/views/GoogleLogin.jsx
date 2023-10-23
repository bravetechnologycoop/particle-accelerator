import PropTypes from 'prop-types'
import React from 'react'
import Button from 'react-bootstrap/Button'
import { useCookies } from 'react-cookie'
import LoginStatus from '../components/general/LoginStatus'

function GoogleLogin(props) {
  const { googleProfile } = props
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(['googleAccessToken'])

  return (
    <div style={{ width: '25ch', padding: 20 }}>
      <h2>Google Login</h2>
      <h4>
        <LoginStatus loginState="true" userName={`${googleProfile.name} (${googleProfile.email})`} />
      </h4>
      <Button
        variant="danger"
        onClick={() => {
          removeCookie('googleAccessToken')
          window.location.reload()
        }}
      >
        Logout
      </Button>
    </div>
  )
}

GoogleLogin.propTypes = { googleProfile: PropTypes.shape.isRequired }

export default GoogleLogin
