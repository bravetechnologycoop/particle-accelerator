import React from 'react'
import { GoogleLogin } from 'react-google-login'

function GoogleOAuth() {
  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT}
      buttonText="Login"
      onSuccess={() => console.log('success')}
      onFailure={() => console.log('failiure')}
      cookiePolicy="single-host-origin"
    />
  )
}

export default GoogleOAuth
