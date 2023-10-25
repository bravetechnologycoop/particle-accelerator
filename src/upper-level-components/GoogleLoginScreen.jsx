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
  const [cookies, setCookie, removeCookie] = useCookies(['googleIdToken'])

  const handleIdToken = async idToken => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_GOOGLE_AUTH_URL}/pa/get-google-payload`, { idToken })

      if (res.status === 200) {
        onLogin({ email: res.data.email, name: res.data.name })
      } else {
        // ID token must be old; force user to re-login
        removeCookie('googleIdToken')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_GOOGLE_AUTH_URL}/pa/get-google-tokens`, { code })
        setCookie('googleIdToken', res.data.id_token)
        handleIdToken(res.data.id_token)
      } catch (error) {
        console.log(error)
      }
    },
    onError: error => console.log('Login Error:', error),
    flow: 'auth-code',
    scope: 'email openid profile',
  })

  // attempt to login with Google access token in cookies (if it exists)
  if (cookies.googleIdToken !== undefined) {
    handleIdToken(cookies.googleIdToken)
    // return a blank page
    return <div />
  }

  return (
    <div className="googleLoginScreen">
      <img src={BraveLogo} alt="Brave" />
      <br />
      <h2>Welcome to the PA.</h2>
      <p>Please login using your Brave email.</p>
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
