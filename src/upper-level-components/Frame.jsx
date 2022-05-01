import PropTypes from 'prop-types'
import React, { useState } from 'react'
import Activator from '../views/Activator'
import Validator from '../views/Validator'
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

import ClickupLogo from '../graphics/ClickupLogo.svg'
import ParticleLogo from '../graphics/ParticleLogo.svg'
import Pages from './Pages'

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
   * modifyActivatedDevice
   * @param clickupTaskID the task ID to change
   * @param fields        array
   * @param newValues     new values
   * @return {boolean}
   */
  function modifyActivatedDevice(clickupTaskID, fields, newValues) {
    if (Array.isArray(fields) && Array.isArray(newValues)) {
      if (fields.length !== newValues.length) {
        return false
      }
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
    />
  )
  viewConfig[Pages.deviceLookup.displayName] = <Validator token={particleToken} changeToken={changeToken} particleSettings={particleSettings} />
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
  viewConfig[Pages.twilio.displayName] = <TwilioPurchasing clickupToken={clickupToken} environment={environment} />
  viewConfig[Pages.buttonRegistration.displayName] = <ButtonRegistration clickupToken={clickupToken} environment={environment} />
  viewConfig[Pages.deviceManager.displayName] = (
    <DeviceManager activatedDevices={activatedDevices} changeActivatedDevices={changeActivatedDevices} clickupToken={clickupToken} />
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
