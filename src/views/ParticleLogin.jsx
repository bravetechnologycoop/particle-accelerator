import PropTypes from 'prop-types'
import React from 'react'
import LoginStatus from '../components/ParticleLogin/LoginStatus'
import LoginForm from '../components/ParticleLogin/LoginForm'
import LogoutButton from '../components/ParticleLogin/LogoutButton'
import ParticleSettings from '../utilities/ParticleSettings'
// import { getParticleLoginState, getParticleToken } from '../utilities/StorageFunctions'

/**
 * ParticleLogin: React Component that provides a login form for a user to login
 * through to access the Activator.
 */
function ParticleLogin(props) {
  const { token, loginState, changeToken, changeLoginState, particleSettings, changeParticleSettings } = props

  if (loginState === 'true') {
    return (
      <>
        <h1>Logged in as: {particleSettings.userName}</h1>
        <LogoutButton changeLoginState={changeLoginState} changeToken={changeToken} token={token} changeParticleSettings={changeParticleSettings} />
      </>
    )
  }
  return (
    <div style={{ width: '25ch' }}>
      <h2>Particle Login</h2>
      <h4>
        <LoginStatus loginState={loginState} userName={particleSettings.userName} />
      </h4>
      <LoginForm changeToken={changeToken} changeLoginState={changeLoginState} changeParticleSettings={changeParticleSettings} />
    </div>
  )
}

ParticleLogin.propTypes = {
  changeToken: PropTypes.func,
  loginState: PropTypes.string,
  changeLoginState: PropTypes.func,
  token: PropTypes.string,
  particleSettings: PropTypes.instanceOf(ParticleSettings),
  changeParticleSettings: PropTypes.func,
}

ParticleLogin.defaultProps = {
  changeToken: () => {},
  loginState: '',
  changeLoginState: () => {},
  token: '',
  particleSettings: new ParticleSettings(),
  changeParticleSettings: () => {},
}

export default ParticleLogin
