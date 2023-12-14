import PropTypes from 'prop-types'
import React, { useState } from 'react'
import Activator from '../views/Activator'
import Validator from '../views/Validator'
import GoogleLogin from '../views/GoogleLogin'
import ParticleLogin from '../views/ParticleLogin'
import ClickupLogin from '../views/ClickupLogin'
import {
  copyActivatedDevices,
  getActivatedDevices,
  getActivationHistory,
  storeActivatedDevices,
  storeActivationHistory,
} from '../utilities/StorageFunctions'
import DoorSensorPairing from '../views/DoorSensorPairing'
import Renamer from '../views/Renamer'
import ParticleSettings from '../utilities/ParticleSettings'
import ButtonRegistration from '../views/ButtonRegistration'
import TwilioPurchasing from '../views/TwilioPurchasing'
import HomeView from '../views/HomeView'
import DeviceManager from '../views/DeviceManager'
import SensorProvisioningGuide from '../views/SensorProvisioningGuide'
import MessageClients from '../views/MessageClients'

import ClickupLogo from '../graphics/ClickupLogo.svg'
import ParticleLogo from '../graphics/ParticleLogo.svg'
import Pages from './Pages'
import SystemStatus from '../views/SystemStatus'

function Frame(props) {
  const {
    particleToken,
    changeToken,
    loginState,
    changeLoginState,
    viewState,
    googlePayload,
    safeModeState,
    particleSettings,
    changeParticleSettings,
    clickupToken,
    changeClickupToken,
    clickupUserName,
    changeClickupUserName,
    clickupListID,
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

  /**
   * ### modifyActivatedDevice
   * modifyActivatedDevice modifies a singular ActivatedDevice within the activatedDevices list. It writes to local memory
   * while changing the hook.
   *
   * modifyActivatedDevice is designed to modify all of the desired properties at once, due to the nature of React's
   * hook updating methods. It was determined in testing that multiple similtaneous calls to modifyActivatedDevices in
   * the same update cycle resulted in only the last field being updated. Due to this, the idea of passing a
   * 'field-value dictionary' was created, where all fields and values would be edited in one function call.
   * @param {string} clickupTaskID
   * @param {Object} fieldValueDictionary
   */
  function modifyActivatedDevice(clickupTaskID, fieldValueDictionary) {
    if (typeof fieldValueDictionary === 'object' && fieldValueDictionary !== null) {
      const copyOfActivatedDevices = copyActivatedDevices(activatedDevices)
      const targetIndex = copyOfActivatedDevices.findIndex(device => device.clickupTaskID === clickupTaskID)

      Object.keys(fieldValueDictionary).forEach(field => {
        copyOfActivatedDevices[targetIndex][field] = fieldValueDictionary[field]
      })

      changeActivatedDevices(copyOfActivatedDevices)
      return true
    }
    return false
  }

  const viewConfig = {}
  viewConfig[Pages.home.displayName] = <HomeView />
  viewConfig[Pages.activator.displayName] = (
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
      environment={environment}
    />
  )
  viewConfig[Pages.deviceLookup.displayName] = <Validator token={particleToken} changeToken={changeToken} particleSettings={particleSettings} />
  viewConfig[Pages.google.displayName] = <GoogleLogin googlePayload={googlePayload} />
  viewConfig[Pages.particle.displayName] = (
    <ParticleLogin
      loginState={loginState}
      changeLoginState={changeLoginState}
      changeToken={changeToken}
      token={particleToken}
      particleSettings={particleSettings}
      changeParticleSettings={changeParticleSettings}
    />
  )
  viewConfig[Pages.doorSensorPairing.displayName] = (
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
  viewConfig[Pages.renamer.displayName] = (
    <Renamer
      activatedDevices={activatedDevices}
      particleToken={particleToken}
      clickupToken={clickupToken}
      clickupListID={clickupListID}
      environment={environment}
      modifyActivatedDevice={modifyActivatedDevice}
    />
  )
  viewConfig[Pages.twilio.displayName] = <TwilioPurchasing environment={environment} />
  viewConfig[Pages.buttonRegistration.displayName] = <ButtonRegistration environment={environment} />
  viewConfig[Pages.deviceManager.displayName] = (
    <DeviceManager
      activatedDevices={activatedDevices}
      changeActivatedDevices={changeActivatedDevices}
      clickupToken={clickupToken}
      environment={environment}
    />
  )
  viewConfig[Pages.sensorGuide.displayName] = <SensorProvisioningGuide />
  viewConfig[Pages.clickup.displayName] = (
    <ClickupLogin
      clickupToken={clickupToken}
      changeClickupToken={changeClickupToken}
      clickupUserName={clickupUserName}
      changeClickupUserName={changeClickupUserName}
    />
  )
  viewConfig[Pages.messageClients.displayName] = <MessageClients environment={environment} />
  viewConfig[Pages.systemStatus.displayName] = <SystemStatus environment={environment} />

  const currentPageInfo = Object.values(Pages).find(page => {
    return page.displayName === viewState
  })

  if (currentPageInfo === undefined) {
    return <HomeView />
  }

  if (currentPageInfo.authorizations.clickup && currentPageInfo.authorizations.particle) {
    if (particleToken !== '' && clickupToken !== '') {
      return viewConfig[viewState]
    }
    return <NotAuthenticated clickup={clickupToken !== ''} particle={particleToken !== ''} />
  }

  if (currentPageInfo.authorizations.particle) {
    if (particleToken !== '') {
      return viewConfig[viewState]
    }
    return <NotAuthenticated particle={false} />
  }

  if (currentPageInfo.authorizations.clickup) {
    if (clickupToken !== '') {
      return viewConfig[viewState]
    }
    return <NotAuthenticated particle={false} />
  }

  return viewConfig[viewState]
}

Frame.propTypes = {
  particleToken: PropTypes.string.isRequired,
  changeToken: PropTypes.func.isRequired,
  loginState: PropTypes.string.isRequired,
  changeLoginState: PropTypes.func.isRequired,
  viewState: PropTypes.string.isRequired,
  googlePayload: PropTypes.shape({
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  safeModeState: PropTypes.bool.isRequired,
  particleSettings: PropTypes.instanceOf(ParticleSettings).isRequired,
  changeParticleSettings: PropTypes.func.isRequired,
  clickupToken: PropTypes.string.isRequired,
  changeClickupToken: PropTypes.func.isRequired,
  clickupUserName: PropTypes.string.isRequired,
  changeClickupUserName: PropTypes.func.isRequired,
  clickupListID: PropTypes.string.isRequired,
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
