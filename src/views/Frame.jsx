import PropTypes from 'prop-types'
import React, { useState } from 'react'
import Activator from './Activator'
import Validator from './Validator'
import ParticleLogin from './ParticleLogin'
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
import DoorSensorPairing from './DoorSensorPairing'
import Renamer from './Renamer'
import ParticleSettings from '../utilities/ParticleSettings'
import ButtonRegistration from './ButtonRegistration'
import TwilioPurchasing from './TwilioPurchasing'
import HomeView from './HomeView'
import DeviceManager from './DeviceManager'
import SensorProvisioningGuide from './SensorProvisioningGuide'

import ClickupLogo from '../graphics/ClickupLogo.svg'
import ParticleLogo from '../graphics/ParticleLogo.svg'

function Frame(props) {
  const {
    particleToken,
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
    environment,
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
    if (particleToken !== '' && clickupToken !== '') {
      return (
        <Activator
          particleToken={particleToken}
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
    return <NotAuthenticated clickup={clickupToken !== ''} particle={particleToken !== ''} />
  }
  if (viewState === 'Device Lookup') {
    return <Validator token={particleToken} changeToken={changeToken} particleSettings={particleSettings} />
  }
  if (viewState === 'Particle') {
    return (
      <ParticleLogin
        loginState={loginState}
        changeLoginState={changeLoginState}
        changeToken={changeToken}
        token={particleToken}
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
    if (particleToken !== '') {
      return (
        <DoorSensorPairing
          activatedDevices={activatedDevices}
          particleToken={particleToken}
          changeActivatedDevices={changeActivatedDevices}
          particleSettings={particleSettings}
          clickupToken={clickupToken}
          clickupListID={clickupListID}
          modifyActivatedDevice={modifyActivatedDevice}
        />
      )
    }
    return <NotAuthenticated particle={particleToken !== ''} />
  }
  if (viewState === 'Renamer') {
    if (particleToken !== '' && clickupToken !== '') {
      return (
        <Renamer
          activatedDevices={activatedDevices}
          particleToken={particleToken}
          clickupToken={clickupToken}
          clickupListID={clickupListID}
          environment={environment}
        />
      )
    }
    return <NotAuthenticated clickup={clickupToken !== ''} particle={particleToken !== ''} />
  }
  if (viewState === 'Twilio Number Purchasing') {
    if (clickupToken !== '') {
      return <TwilioPurchasing clickupToken={clickupToken} environment={environment} />
    }
    return <NotAuthenticated clickup={clickupToken !== ''} />
  }
  if (viewState === 'Button Registration') {
    if (clickupToken !== '') {
      return <ButtonRegistration clickupToken={clickupToken} environment={environment} />
    }
    return <NotAuthenticated clickup={clickupToken !== ''} />
  }
  if (viewState === 'Device Manager') {
    if (clickupToken !== '') {
      return <DeviceManager activatedDevices={activatedDevices} changeActivatedDevices={changeActivatedDevices} clickupToken={clickupToken} />
    }
    return <NotAuthenticated clickup={clickupToken !== ''} />
  }
  if (viewState === 'Sensor Provisioning Guide') {
    if (clickupToken !== '') {
      return <SensorProvisioningGuide />
    }
    return <NotAuthenticated clickup={clickupToken !== ''} />
  }
  return <HomeView />
}

Frame.propTypes = {
  particleToken: PropTypes.string.isRequired,
  changeToken: PropTypes.func.isRequired,
  loginState: PropTypes.string.isRequired,
  changeLoginState: PropTypes.func.isRequired,
  viewState: PropTypes.string.isRequired,
  safeModeState: PropTypes.bool.isRequired,
  particleSettings: PropTypes.instanceOf(ParticleSettings).isRequired,
  changeParticleSettings: PropTypes.func.isRequired,
  clickupToken: PropTypes.string.isRequired,
  changeClickupToken: PropTypes.func.isRequired,
  clickupUserName: PropTypes.string.isRequired,
  changeClickupUserName: PropTypes.func.isRequired,
  clickupListID: PropTypes.string.isRequired,
  changeClickupListID: PropTypes.func.isRequired,
  environment: PropTypes.string.isRequired,
}

function NotAuthenticated(props) {
  const { clickup, particle } = props

  const styles = {
    main: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 'inherit',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    image: {
      height: '150px',
    },
  }

  if (!clickup && !particle) {
    return (
      <div style={styles.main}>
        <h2>Not Authenticated</h2>
        <div style={styles.row}>
          <a href="/clickup">
            <img src={ClickupLogo} alt="Clickup Logo" style={styles.image} />
          </a>
          <a href="/particle">
            <img src={ParticleLogo} alt="Particle Logo" style={styles.image} />
          </a>
        </div>
      </div>
    )
  }

  if (!clickup) {
    return (
      <div style={styles.main}>
        <h2>Not Authenticated</h2>
        <div style={styles.row}>
          <a href="/clickup">
            <img src={ClickupLogo} alt="Clickup Logo" style={styles.image} />
          </a>
        </div>
      </div>
    )
  }

  if (!particle) {
    return (
      <div style={styles.main}>
        <h2>Not Authenticated</h2>
        <div style={styles.row}>
          <a href="/particle">
            <img src={ParticleLogo} alt="Particle Logo" style={styles.image} />
          </a>
        </div>
      </div>
    )
  }
}

NotAuthenticated.propTypes = {
  clickup: PropTypes.bool,
  particle: PropTypes.bool,
}

NotAuthenticated.defaultProps = {
  clickup: true,
  particle: true,
}

export default Frame
