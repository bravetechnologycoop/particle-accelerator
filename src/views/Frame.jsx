import PropTypes from 'prop-types'
import React, { useState } from 'react'
import ActivatorView from './ActivatorView'
import Validator from './Validator'
import LoginView from './LoginView'
import ClickupLogin from './ClickupLogin'
import ActivationHistory from './ActivationHistory'
import {
  copyActivatedDevices,
  getActivatedDevices,
  getActivationHistory,
  storeActivatedDevices,
  storeActivationHistory,
} from '../utilities/StorageFunctions'
import ActivatedDevices from './ActivatedDevices'
import DoorSensorView from './DoorSensorView'
import RenamerView from './RenamerView'
import ParticleSettings from '../utilities/ParticleSettings'
import ButtonRegistrationView from './ButtonRegistrationView'
import TwilioPurchaseView from './TwilioPurchaseView'
import HomeView from './HomeView'
import DeviceManager from './DeviceManager'
import SensorProvisioningGuide from './SensorProvisioningGuide'
import GoogleOAuth from './GoogleOAuth'

function Frame(props) {
  const {
    token,
    changeToken,
    loginState,
    changeLoginState,
    viewState,
    safeModeState,
    particleSettings,
    changeParticleSettings,
    clickupToken,
    changeClickupToken,
    clickupUserName,
    changeClickupUserName,
    clickupListID,
    changeClickupListID,
  } = props

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

  function modifyActivatedDevice(clickupTaskID, fields, newValues) {
    console.log('fields: ', fields, 'new values: ', newValues)

    if (Array.isArray(fields) && Array.isArray(newValues)) {
      console.log('is array')
      if (fields.length !== newValues.length) {
        return false
      }
      console.log('same length')
      const copyOfActivatedDevices = copyActivatedDevices(activatedDevices)
      const targetIndex = copyOfActivatedDevices.findIndex(device => device.clickupTaskID === clickupTaskID)
      console.log('target index', targetIndex)

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < fields.length; i++) {
        copyOfActivatedDevices[targetIndex][fields[i]] = newValues[i]
        console.log(copyOfActivatedDevices)
      }
      changeActivatedDevices(copyOfActivatedDevices)
      return true
    }

    const copyOfActivatedDevices = copyActivatedDevices(activatedDevices)
    const targetIndex = copyOfActivatedDevices.findIndex(device => device.clickupTaskID === clickupTaskID)
    console.log('target index', targetIndex)

    copyOfActivatedDevices[targetIndex][fields] = newValues
    changeActivatedDevices(copyOfActivatedDevices)
    return true
  }

  if (viewState === 'Activator') {
    return (
      <ActivatorView
        token={token}
        changeToken={changeToken}
        activationHistory={activationHistory}
        activatedDevices={activatedDevices}
        changeActivationHistory={changeActivationHistory}
        changeActivatedDevices={changeActivatedDevices}
        safeModeState={safeModeState}
        particleSettings={particleSettings}
        clickupToken={clickupToken}
        clickupListID={clickupListID}
      />
    )
  }
  if (viewState === 'Device Lookup') {
    return <Validator token={token} changeToken={changeToken} particleSettings={particleSettings} />
  }
  if (viewState === 'Particle') {
    return (
      <LoginView
        loginState={loginState}
        changeLoginState={changeLoginState}
        changeToken={changeToken}
        token={token}
        particleSettings={particleSettings}
        changeParticleSettings={changeParticleSettings}
      />
    )
  }
  if (viewState === 'ClickUp') {
    return (
      <ClickupLogin
        clickupToken={clickupToken}
        changeClickupToken={changeClickupToken}
        clickupListID={clickupListID}
        changeClickupListID={changeClickupListID}
        clickupUserName={clickupUserName}
        changeClickupUserName={changeClickupUserName}
      />
    )
  }
  if (viewState === 'Activation History') {
    return <ActivationHistory activationHistory={activationHistory} />
  }
  if (viewState === 'Activated Devices') {
    return <ActivatedDevices activatedDeviceList={activatedDevices} />
  }
  if (viewState === 'Door Sensor Pairing') {
    return (
      <DoorSensorView
        activatedDevices={activatedDevices}
        particleToken={token}
        changeActivatedDevices={changeActivatedDevices}
        particleSettings={particleSettings}
        clickupToken={clickupToken}
        clickupListID={clickupListID}
        modifyActivatedDevice={modifyActivatedDevice}
      />
    )
  }
  if (viewState === 'Renamer') {
    return (
      <RenamerView
        particleSettings={particleSettings}
        activatedDevices={activatedDevices}
        particleToken={token}
        clickupToken={clickupToken}
        clickupListID={clickupListID}
      />
    )
  }
  if (viewState === 'Twilio Number Purchasing') {
    return <TwilioPurchaseView clickupToken={clickupToken} />
  }
  if (viewState === 'Button Registration') {
    return <ButtonRegistrationView clickupToken={clickupToken} />
  }
  if (viewState === 'Device Manager') {
    return <DeviceManager activatedDevices={activatedDevices} changeActivatedDevices={changeActivatedDevices} clickupToken={clickupToken} />
  }
  if (viewState === 'Sensor Provisioning Guide') {
    return <SensorProvisioningGuide />
  }
  if (viewState === 'Google') {
    return <GoogleOAuth />
  }
  return <HomeView />
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
  clickupToken: PropTypes.string,
  changeClickupToken: PropTypes.func,
  clickupUserName: PropTypes.string,
  changeClickupUserName: PropTypes.func,
  clickupListID: PropTypes.string,
  changeClickupListID: PropTypes.func,
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
  clickupToken: '',
  changeClickupToken: () => {},
  clickupUserName: '',
  changeClickupUserName: () => {},
  clickupListID: '',
  changeClickupListID: () => {},
}

export default Frame
