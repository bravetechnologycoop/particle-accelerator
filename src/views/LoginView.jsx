import PropTypes from 'prop-types'
import React from 'react'
import LoginStatus from '../components/LoginStatus'
import LoginForm from '../components/LoginForm'
import WelcomeText from '../components/WelcomeText'
import LogoutButton from '../components/LogoutButton'
// import { getParticleLoginState, getParticleToken } from '../utilities/StorageFunctions'

/**
 * LoginView: React Component that provides a login form for a user to login
 * through to access the ActivatorView.
 */
function LoginView(props) {
  const { token, loginState, changeToken, changeLoginState } = props

  /* useEffect(() => {
    changeToken(getParticleToken())
    changeLoginState(getParticleLoginState())
  }) */

  if (loginState === 'true') {
    return (
      <>
        <h1>
          Logged in as: <WelcomeText token={token} />
        </h1>
        <LogoutButton changeLoginState={changeLoginState} changeToken={changeToken} token={token} />
      </>
    )
  }
  return (
    <>
      <h2>Particle Accelerator</h2>
      <h4>
        <LoginStatus loginState={loginState} token={token} />
      </h4>
      <LoginForm changeToken={changeToken} changeLoginState={changeLoginState} />
    </>
  )
}

LoginView.propTypes = {
  changeToken: PropTypes.func,
  loginState: PropTypes.string,
  changeLoginState: PropTypes.func,
  token: PropTypes.string,
}

LoginView.defaultProps = {
  changeToken: () => {},
  loginState: '',
  changeLoginState: () => {},
  token: '',
}

export default LoginView
