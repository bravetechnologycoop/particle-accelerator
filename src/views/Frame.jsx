import PropTypes from 'prop-types'
import React, { useState } from 'react'
import ActivatorView from './ActivatorView'
import Validator from '../components/Validator'
import LoginView from './LoginView'
import ClickupLogin from './ClickupLogin'
import ActivationHistory from './ActivationHistory'
import { getActivatedDevices, getActivationHistory, storeActivatedDevices, storeActivationHistory } from '../utilities/StorageFunctions'
import ActivatedDevices from './ActivatedDevices'
import DoorSensorView from './DoorSensorView'
import RenamerView from './RenamerView'
import ParticleSettings from '../utilities/ParticleSettings'

function Frame(props) {
  const { token, changeToken, loginState, changeLoginState, viewState, safeModeState, particleSettings, changeParticleSettings } = props

  const [activationHistory, setActivationHistory] = useState(getActivationHistory())
  const [activatedDevices, setActivatedDevices] = useState(getActivatedDevices())

  function changeActivationHistory(newHistory) {
    setActivationHistory(newHistory)
    storeActivationHistory(newHistory)
  }

  function changeActivatedDevices(newActivatedDevices) {
    setActivatedDevices(newActivatedDevices)
    storeActivatedDevices(newActivatedDevices)
  }

  const styles = {
    main: {
      height: '100vh',
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
          particleSettings={particleSettings}
        />
      </div>
    )
  }
  if (viewState === 'Validator') {
    return (
      <div style={styles.main}>
        <Validator token={token} changeToken={changeToken} particleSettings={particleSettings} />
      </div>
    )
  }
  if (viewState === 'Particle') {
    return (
      <div style={styles.main}>
        <LoginView
          loginState={loginState}
          changeLoginState={changeLoginState}
          changeToken={changeToken}
          token={token}
          particleSettings={particleSettings}
          changeParticleSettings={changeParticleSettings}
        />
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
  if (viewState === 'Door Sensor Pairing') {
    return (
      <div style={styles.main}>
        <DoorSensorView activatedDevices={activatedDevices} />
      </div>
    )
  }
  if (viewState === 'Renamer') {
    return (
      <div style={styles.main}>
        <RenamerView particleSettings={particleSettings} activatedDevices={activatedDevices} token={token} />
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
  particleSettings: PropTypes.instanceOf(ParticleSettings),
  changeParticleSettings: PropTypes.func,
}

Frame.defaultProps = {
  token: '',
  changeToken: () => {},
  loginState: 'false',
  changeLoginState: () => {},
  viewState: 'Home',
  safeModeState: false,
  particleSettings: new ParticleSettings(),
  changeParticleSettings: () => {},
}

export default Frame
