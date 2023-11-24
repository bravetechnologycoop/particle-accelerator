import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import PropTypes from 'prop-types'
import axios from 'axios'
import { useGoogleLogin } from '@react-oauth/google'

import Button from 'react-bootstrap/Button'

import '../stylesheets/GoogleLoginScreen.css'
import BraveLogoHorizontalSlate from '../pdf/BraveLogoHorizontalSlate.png'

function GoogleLoginScreen(props) {
  const { onLogin } = props
  const [cookies, setCookie, removeCookie] = useCookies(['googleIdToken'])
  const [errorMessage, setErrorMessage] = useState('Waiting for user login.')

  async function handleGoogleIdToken(googleIdToken) {
    try {
      const res = await axios.post(`${process.env.REACT_APP_PA_GOOGLE_API}/pa/get-google-payload`, { googleIdToken })

      // throw Error (also remove cookie for Google ID token) in the event of failure
      /* NOTE: there are too many fields in the Google payload to check for each;
       * expect that if res.data exists, it is properly populated. */
      if (res.status !== 200 || !res.data) {
        throw new Error('There was a problem interacting with the PA Google API.')
      }

      const googlePayload = res.data

      // run login function while providing only the email and name of the account
      onLogin({ email: googlePayload.email, name: googlePayload.name })
    } catch (error) {
      setErrorMessage(error.message)
      removeCookie('googleIdToken') // ensure cookie is undefined
    }
  }

  const googleLogin = useGoogleLogin({
    /* Use the Google authorization code flow; this means that a separate OAuth2 client
     * will get tokens from Google using a received Google authorization code. */
    flow: 'auth-code',
    // upon successful log in of a Google account and the receival of an authorization code (response.code)
    onSuccess: async response => {
      const googleAuthCode = response.code

      try {
        const res = await axios.post(`${process.env.REACT_APP_PA_GOOGLE_API}/pa/get-google-tokens`, { googleAuthCode })

        // ensure that response was successful and returned all tokens needed
        if (res.status !== 200 || !res.data || !res.data.googleAccessToken || !res.data.googleIdToken) {
          throw new Error('There was a problem interacting with the PA Google API.')
        }

        // googleTokens contains members googleAccessToken and googleIdToken
        /* NOTE: at present, googleAccessToken is not used, and is discarded after this function completes.
         * For further interaction with Google's APIs, googleAccessToken will become useful. */
        const googleTokens = res.data

        setCookie('googleIdToken', googleTokens.googleIdToken)
        handleGoogleIdToken(googleTokens.googleIdToken)
      } catch (error) {
        setErrorMessage(error.message)
        removeCookie('googleIdToken') // unsure cookie is undefined
      }
    },
    onError: error => setErrorMessage(error.message),
    // see https://developers.google.com/identity/protocols/oauth2/scopes#google-sign-in
    scope: 'email openid profile',
  })

  // attempt to log in if a Google ID token exists in cookies on page load
  useEffect(() => {
    if (cookies.googleIdToken !== undefined) {
      handleGoogleIdToken(cookies.googleIdToken)
    }
  }, [])

  // return a blank page pending handleGoogleIdToken resolves and cookies.googleIdToken becomes undefined
  if (cookies.googleIdToken !== undefined)
    return <div />

  // return the Google login screen
  return (
    <div className="googleLoginScreen">
      <div className="googleLoginScreenContainer">
        <img src={BraveLogoHorizontalSlate} alt="Brave" />
        <h2>Welcome to the PA.</h2>
        <p>Please log in using your Brave email.</p>
        <Button
          variant="primary"
          onClick={() => {
            setErrorMessage('Waiting for server response...')
            googleLogin()
          }}
        >
          Login
        </Button>
        <p className="errorMessage">{errorMessage}</p>
      </div>
    </div>
  )
}

GoogleLoginScreen.propTypes = {
  onLogin: PropTypes.func.isRequired,
}

export default GoogleLoginScreen
