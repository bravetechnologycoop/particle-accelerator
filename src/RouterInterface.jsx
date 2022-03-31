import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Navigation from './components/Navigation'
import Frame from './views/Frame'
import {
  getClickupToken,
  getParticleLoginState,
  getParticleSettings,
  getParticleToken,
  getSafeModeState,
  retClickupListID,
  retClickupUserName,
  storeClickupListID,
  storeClickupToken,
  storeClickupUserName,
  storeParticleLoginState,
  storeParticleSettings,
  storeParticleToken,
  storeSafeModeState,
} from './utilities/StorageFunctions'
import ParticleSettings from './utilities/ParticleSettings'

function RouterInterface(props) {
  const { viewState, changeViewState } = props

  const [token, setToken] = useState(getParticleToken())
  const [loginState, setLoginState] = useState(getParticleLoginState())
  const [safeMode, setSafeMode] = useState(getSafeModeState())
  const [particleSettings, setParticleSettings] = useState(getParticleSettings())
  const [clickupToken, setClickupToken] = useState(getClickupToken())
  const [clickupUserName, setClickupUserName] = useState(retClickupUserName())
  const [clickupListID, setClickupListID] = useState(retClickupListID())

  function changeClickupListID(newClickupListID) {
    storeClickupListID(newClickupListID)
    setClickupListID(newClickupListID)
  }

  function changeClickupUserName(newUserName) {
    storeClickupUserName(newUserName)
    setClickupUserName(newUserName)
  }

  function changeClickupToken(newToken) {
    storeClickupToken(newToken)
    setClickupToken(newToken)
  }

  function changeParticleSettings(setting, newValue) {
    const storedParticleSettings = getParticleSettings()

    const newParticleSettings = new ParticleSettings(
      storedParticleSettings.userName,
      storedParticleSettings.productFirmwareVersion,
      storedParticleSettings.deviceOSVersion,
      storedParticleSettings.productList,
    )

    if (setting === 'userName') {
      newParticleSettings.userName = newValue
      setParticleSettings(newParticleSettings)
      storeParticleSettings(newParticleSettings)
    } else if (setting === 'productFirmwareVersion') {
      newParticleSettings.productFirmwareVersion = newValue
      setParticleSettings(newParticleSettings)
      storeParticleSettings(newParticleSettings)
    } else if (setting === 'deviceOSVersion') {
      newParticleSettings.deviceOSVersion = newValue
      setParticleSettings(newParticleSettings)
      storeParticleSettings(newParticleSettings)
    } else if (setting === 'productList') {
      newParticleSettings.productList = newValue
      setParticleSettings(newParticleSettings)
      storeParticleSettings(newParticleSettings)
    } else if (setting === 'clear' && newValue === 'clear') {
      const blankSettings = new ParticleSettings('', '', '', [])
      setParticleSettings(blankSettings)
      storeParticleSettings(blankSettings)
    }
  }

  function changeToken(newToken) {
    storeParticleToken(newToken)
    setToken(newToken)
  }

  function changeLoginState(newState) {
    storeParticleLoginState(newState)
    setLoginState(newState)
  }

  function changeSafeModeState(newState) {
    storeSafeModeState(newState)
    setSafeMode(newState)
  }

  const styles = {
    parent: {
      display: 'flex',
      height: '100vh',
      width: '100vw',
      justifyContent: 'center',
    },
    main: {
      flex: '8 8 85%',
      order: 2,
      padding: 20,
      alignItems: 'top',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    navbar: {
      flex: '1 1 15%',
      order: 1,
      padding: 0,
      alignItems: 'top',
      display: 'flex',
      flexDirection: 'column',
    },
  }

  return (
    // eslint-disable-next-line react/jsx-no-bind
    <div style={styles.parent}>
      <div style={styles.navbar}>
        <Navigation
          viewState={viewState}
          changeViewState={changeViewState}
          loginStatus={loginState}
          token={token}
          changeToken={changeToken}
          changeLoginState={changeLoginState}
          safeModeState={safeMode}
          changeSafeModeState={changeSafeModeState}
          particleSettings={particleSettings}
          clickupToken={clickupToken}
          clickupUserName={clickupUserName}
        />
      </div>
      <div style={styles.main}>
        <Frame
          changeLoginState={changeLoginState}
          changeToken={changeToken}
          loginState={loginState}
          token={token}
          viewState={viewState}
          safeModeState={safeMode}
          changeSafeModeState={changeSafeModeState}
          particleSettings={particleSettings}
          changeParticleSettings={changeParticleSettings}
          clickupToken={clickupToken}
          changeClickupToken={changeClickupToken}
          clickupUserName={clickupUserName}
          changeClickupUserName={changeClickupUserName}
          clickupListID={clickupListID}
          changeClickupListID={changeClickupListID}
        />
      </div>
    </div>
  )
}

RouterInterface.propTypes = {
  viewState: PropTypes.string,
  changeViewState: PropTypes.func,
}

RouterInterface.defaultProps = {
  viewState: '',
  changeViewState: () => {},
}

export default RouterInterface
