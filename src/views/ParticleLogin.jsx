import PropTypes from 'prop-types'
import React from 'react'
import LoginStatus from '../components/general/LoginStatus'
import LoginForm from '../components/ParticleLogin/LoginForm'
import LogoutButton from '../components/ParticleLogin/LogoutButton'
import ParticleSettings from '../utilities/ParticleSettings'

/**
 * ParticleLogin: React Component that provides a login form for a user to login
 * through to access the Activator.
 */
function ParticleLogin(props) {
  const { token, loginState, changeToken, changeLoginState, particleSettings, changeParticleSettings } = props

  if (loginState === 'true') {
    return (
      <div style={{ padding: 20 }}>
        <h1>Logged in as: {particleSettings.userName}</h1>
        <LogoutButton changeLoginState={changeLoginState} changeToken={changeToken} token={token} changeParticleSettings={changeParticleSettings} />
      </div>
    )
  }
  return (
    <div style={{ width: '25ch', padding: 20 }}>
      <h2>Particle Login</h2>
      <h4>
        <LoginStatus loginState={loginState} userName={particleSettings.userName} />
      </h4>
      <LoginForm changeToken={changeToken} changeLoginState={changeLoginState} changeParticleSettings={changeParticleSettings} />
    </div>
  )
}

ParticleLogin.propTypes = {
  token: PropTypes.string.isRequired,
  changeToken: PropTypes.func.isRequired,
  loginState: PropTypes.string.isRequired,
  changeLoginState: PropTypes.func.isRequired,
  particleSettings: PropTypes.instanceOf(ParticleSettings).isRequired,
  changeParticleSettings: PropTypes.func.isRequired,
}

export default ParticleLogin
