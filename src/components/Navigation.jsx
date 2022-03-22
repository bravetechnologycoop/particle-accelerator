import { ButtonGroup } from 'react-bootstrap'

import './Navigation.css'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import RowButton from './RowButton'
import LoginRowButton from './LoginRowButton'
import { getActivationHistory, getParticleLoginState, getParticleToken } from '../utilities/StorageFunctions'
import RowToggler from './RowToggler'
import ParticleSettings from '../utilities/ParticleSettings'

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
        <h1>Particle Accelerator</h1>
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
          <RowButton label="Activator" handler={changeViewState} state={viewState} enabled={loginStatus === 'true'} />
          <RowButton label="Activation History" handler={changeViewState} state={viewState} enabled={getActivationHistory() !== []} />
          <RowButton label="Activated Devices" handler={changeViewState} state={viewState} />
          <RowButton label="Validator" handler={changeViewState} state={viewState} enabled={loginStatus === 'true'} />
          <RowButton label="Door Sensor Pairing" handler={changeViewState} state={viewState} />
          <RowButton label="Renamer" handler={changeViewState} state={viewState} enabled={loginStatus === 'true'} />
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
