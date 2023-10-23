import '../stylesheets/GoogleLoginScreen.css'
import React from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import { useCookies } from 'react-cookie'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import BraveLogo from '../pdf/BraveLogo.svg'

function GoogleLoginScreen(props) {
  const { onLogin } = props
  const [cookies, setCookie] = useCookies(['googleAccessToken'])

  const handleAccessToken = async accessToken => {
    try {
      const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      })

      if (res.status === 200) onLogin(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const login = useGoogleLogin({
    onSuccess: response => {
      setCookie('googleAccessToken', response.access_token)
      handleAccessToken(response.access_token)
    },
    onError: error => console.log('Login Error:', error),
  })

  // attempt to login with Google access token in cookies (if it exists)
  if (cookies.googleAccessToken !== undefined) {
    handleAccessToken(cookies.googleAccessToken)
  }

  return (
    <div className="googleLoginScreen">
      <img src={BraveLogo} alt="Brave" />
      <br />
      <h2>Welcome to the PA.</h2>
      <p>Please log in using your Brave email.</p>
      <Button variant="primary" onClick={() => login()}>
        Login
      </Button>
    </div>
  )
}

GoogleLoginScreen.propTypes = {
  onLogin: PropTypes.func.isRequired,
}

export default GoogleLoginScreen
