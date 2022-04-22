import { ButtonGroup } from 'react-bootstrap'

import './Navigation.css'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import RowButton from '../components/RowButton'
import LoginRowButton from '../components/LoginRowButton'
import { getActivationHistory, getParticleLoginState, getParticleToken } from '../utilities/StorageFunctions'
import RowToggler from '../components/RowToggler'
import ParticleSettings from '../utilities/ParticleSettings'
import BraveLogoWhite from '../pdf/BraveLogoWhite.svg'

function Navigation(props) {
  const {
    viewState,
    changeViewState,
    loginStatus,
    changeToken,
    changeLoginState,
    safeModeState,
    changeSafeModeState,
    particleSettings,
    clickupUserName,
    clickupToken,
  } = props

  useEffect(() => {
    changeToken(getParticleToken())
    changeLoginState(getParticleLoginState())
  })

  const styles = {
    parent: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
    },
    header: {
      flex: '1 0 15%',
      justifyContent: 'center',
      background: '#042857',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      paddingLeft: '1em',
      paddingRight: '1em',
    },
    navi: {
      flex: '10 0 85%',
      background: '#042857',
      display: 'flex',
      flexDirection: 'column',
    },
  }
  return (
    <div style={styles.parent}>
      <div style={styles.header}>
        <img src={BraveLogoWhite} alt="Brave Logo" height="100px" />
      </div>
      <div style={styles.navi}>
        <ButtonGroup vertical>
          <RowButton label="Home" handler={changeViewState} state={viewState} />
          <LoginRowButton
            label="Particle"
            handler={changeViewState}
            state={viewState}
            loginState={loginStatus}
            changeToken={changeToken}
            userName={particleSettings.userName}
          />
          <LoginRowButton
            label="ClickUp"
            handler={changeViewState}
            state={viewState}
            loginState={`${clickupToken !== ''}`}
            userName={clickupUserName}
          />
          <RowButton label="Activator" handler={changeViewState} state={viewState} enabled={loginStatus === 'true'} particle />
          <RowButton label="Activation History" handler={changeViewState} state={viewState} enabled={getActivationHistory().length !== 0} />
          <RowButton label="Activated Devices" handler={changeViewState} state={viewState} />
          <RowButton label="Device Lookup" handler={changeViewState} state={viewState} enabled={loginStatus === 'true'} particle />
          <RowButton label="Door Sensor Pairing" handler={changeViewState} state={viewState} enabled={loginStatus === 'true'} particle />
          <RowButton label="Renamer" handler={changeViewState} state={viewState} />
          <RowButton label="Button Registration" handler={changeViewState} state={viewState} enabled={clickupToken !== ''} clickup />
          <RowButton label="Twilio Number Purchasing" handler={changeViewState} state={viewState} enabled={clickupToken !== ''} clickup />
          <RowToggler label="Safe Mode" toggleState={safeModeState} changeToggleState={changeSafeModeState} />
        </ButtonGroup>
      </div>
    </div>
  )
}

Navigation.propTypes = {
  viewState: PropTypes.string,
  changeViewState: PropTypes.func,
  loginStatus: PropTypes.string,
  changeToken: PropTypes.func,
  changeLoginState: PropTypes.func,
  safeModeState: PropTypes.bool,
  changeSafeModeState: PropTypes.func,
  particleSettings: PropTypes.instanceOf(ParticleSettings),
  clickupToken: PropTypes.string,
  clickupUserName: PropTypes.string,
}

Navigation.defaultProps = {
  viewState: 'Home',
  changeViewState: () => {},
  loginStatus: '',
  changeToken: () => {},
  changeLoginState: PropTypes.func,
  safeModeState: true,
  changeSafeModeState: () => {},
  particleSettings: new ParticleSettings(),
  clickupToken: '',
  clickupUserName: '',
}

export default Navigation