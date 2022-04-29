import { ButtonGroup, Form } from 'react-bootstrap'

import '../stylesheets/Navigation.css'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import RowButton from '../components/Navigation/RowButton'
import LoginRowButton from '../components/Navigation/LoginRowButton'
import { getActivationHistory, getParticleLoginState, getParticleToken } from '../utilities/StorageFunctions'
import RowToggler from '../components/Navigation/RowToggler'
import ParticleSettings from '../utilities/ParticleSettings'
import BraveLogoWhite from '../pdf/BraveLogoWhite.svg'
import { Environments } from '../utilities/Constants'

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
    environment,
    changeEnvironment,
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
      background: '#042857',
      justifyContent: 'space-between',
    },
    header: {
      justifyContent: 'center',
      background: '#042857',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      paddingLeft: '1em',
      paddingRight: '1em',
      paddingTop: '2vh',
      paddingBottom: '2vh',
    },
    navi: {
      background: '#042857',
      flexGrow: '1',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    },
    buttonGroup: {
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
        <RowButton label="Device Manager" handler={changeViewState} state={viewState} />
        <RowButton
          label="Activator"
          handler={changeViewState}
          state={viewState}
          enabled={loginStatus === 'true' && clickupToken !== ''}
          particle
          clickup
        />
        <RowButton label="Device Lookup" handler={changeViewState} state={viewState} enabled={loginStatus === 'true'} particle />
        <RowButton label="Door Sensor Pairing" handler={changeViewState} state={viewState} enabled={loginStatus === 'true'} particle />
        <RowButton label="Renamer" handler={changeViewState} state={viewState} enabled={loginStatus === 'true' && clickupToken !== ''} />
        <RowButton label="Sensor Provisioning Guide" handler={changeViewState} state={viewState} />
        <RowButton label="Button Registration" handler={changeViewState} state={viewState} enabled={clickupToken !== ''} clickup />
        <RowButton label="Twilio Number Purchasing" handler={changeViewState} state={viewState} enabled={clickupToken !== ''} clickup />
      </div>
      <div style={styles.buttonGroup}>
        <Form>
          <Form.Control as="select" className="modeSelector" value={environment} onChange={x => changeEnvironment(x.target.value)}>
            <option key={Environments.prod.name} id={Environments.prod.name} value={Environments.prod.name}>
              {Environments.prod.displayName}
            </option>
            <option key={Environments.dev.name} id={Environments.dev.name} value={Environments.dev.name}>
              {Environments.dev.displayName}
            </option>
            <option key={Environments.staging.name} id={Environments.staging.name} value={Environments.staging.name}>
              {Environments.staging.displayName}
            </option>
          </Form.Control>
        </Form>
        <RowToggler label="Safe Mode" toggleState={safeModeState} changeToggleState={changeSafeModeState} />
      </div>
    </div>
  )
}

Navigation.propTypes = {
  viewState: PropTypes.string.isRequired,
  changeViewState: PropTypes.func.isRequired,
  loginStatus: PropTypes.string.isRequired,
  changeToken: PropTypes.func.isRequired,
  changeLoginState: PropTypes.func.isRequired,
  safeModeState: PropTypes.bool.isRequired,
  changeSafeModeState: PropTypes.func.isRequired,
  particleSettings: PropTypes.instanceOf(ParticleSettings).isRequired,
  clickupToken: PropTypes.string.isRequired,
  clickupUserName: PropTypes.string.isRequired,
  environment: PropTypes.string.isRequired,
  changeEnvironment: PropTypes.func.isRequired,
}

export default Navigation
