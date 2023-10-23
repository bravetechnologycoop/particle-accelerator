import '../stylesheets/GoogleLoginScreen.css'
import React from 'react'
import PropTypes from 'prop-types'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import BraveLogo from '../pdf/BraveLogo.svg'

function GoogleLoginScreen(props) {
  const { onLogin } = props

  const handleAccessToken = async accessToken => {
    try {
      const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      })

      onLogin(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const login = useGoogleLogin({
    onSuccess: response => {
      handleAccessToken(response.access_token)
    },
    onError: error => console.log('Login Error:', error),
  })

  return (
    <div className="googleLoginScreen">
      <img src={BraveLogo} alt="Brave Logo" />
      <h2>Please log in to use PA.</h2>
      <button type="button" onClick={() => login()}>
        Sign in with Google
      </button>
    </div>
  )
}

GoogleLoginScreen.propTypes = {
  onLogin: PropTypes.func.isRequired,
}

export default GoogleLoginScreen
