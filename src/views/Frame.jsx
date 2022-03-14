import PropTypes from 'prop-types'
import React, { useState } from 'react'
import ActivatorView from './ActivatorView'
import Validator from '../components/Validator'
import LoginView from './LoginView'
import ClickupLogin from './ClickupLogin'
import ActivationHistory from './ActivationHistory'
import { getActivatedDevices, getActivationHistory } from '../utilities/StorageFunctions'
import ActivatedDevices from './ActivatedDevices'

function Frame(props) {
  const { token, changeToken, loginState, changeLoginState, viewState, safeModeState } = props

  const [activationHistory, setActivationHistory] = useState(getActivationHistory())
  const [activatedDevices, setActivatedDevices] = useState(getActivatedDevices())

  function changeActivationHistory(newHistory) {
    setActivationHistory(newHistory)
  }

  function changeActivatedDevices(newActivatedDevices) {
    setActivatedDevices(newActivatedDevices)
  }

  const styles = {
    main: {
      overflow: 'auto',
    },
  }

  if (viewState === 'Activator') {
    return (
      <div style={styles.main}>
        <ActivatorView
          token={token}
          changeToken={changeToken}
          activationHistory={activationHistory}
          activatedDevices={activatedDevices}
          changeActivationHistory={changeActivationHistory}
          changeActivatedDevices={changeActivatedDevices}
          safeModeState={safeModeState}
        />
      </div>
    )
  }
  if (viewState === 'Validator') {
    return (
      <div style={styles.main}>
        <Validator token={token} changeToken={changeToken} />
      </div>
    )
  }
  if (viewState === 'Particle') {
    return (
      <div style={styles.main}>
        <LoginView loginState={loginState} changeLoginState={changeLoginState} changeToken={changeToken} token={token} />
      </div>
    )
  }
  if (viewState === 'ClickUp') {
    return (
      <div style={styles.main}>
        <ClickupLogin />
      </div>
    )
  }
  if (viewState === 'Activation History') {
    return (
      <div style={styles.main}>
        <ActivationHistory activationHistory={activationHistory} />
      </div>
    )
  }
  if (viewState === 'Activated Devices') {
    return (
      <div style={styles.main}>
        <ActivatedDevices activatedDeviceList={activatedDevices} />
      </div>
    )
  }
  return (
    <div style={styles.main}>
      <h1>home</h1>
    </div>
  )
}

Frame.propTypes = {
  token: PropTypes.string,
  changeToken: PropTypes.func,
  loginState: PropTypes.string,
  changeLoginState: PropTypes.func,
  viewState: PropTypes.string,
  safeModeState: PropTypes.bool,
}

Frame.defaultProps = {
  token: '',
  changeToken: () => {},
  loginState: 'false',
  changeLoginState: () => {},
  viewState: 'Home',
  safeModeState: false,
}

export default Frame
