import { Form } from 'react-bootstrap'

import '../stylesheets/Navigation.css'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import RowButton from '../components/Navigation/RowButton'
import LoginRowButton from '../components/Navigation/LoginRowButton'
import { getParticleLoginState, getParticleToken } from '../utilities/StorageFunctions'
import RowToggler from '../components/Navigation/RowToggler'
import ParticleSettings from '../utilities/ParticleSettings'
import BraveLogoWhite from '../pdf/BraveLogoWhite.svg'
import { Environments } from '../utilities/Constants'
import Pages from './Pages'

function Navigation(props) {
  const {
    viewState,
    googlePayload,
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

  const loginButtonConfig = {}

  loginButtonConfig[Pages.google.displayName] = {
    loginState: 'true',
    userName: googlePayload.name,
  }
  loginButtonConfig[Pages.particle.displayName] = {
    loginState: loginStatus,
    changeToken,
    userName: particleSettings.userName,
  }
  loginButtonConfig[Pages.clickup.displayName] = {
    loginState: `${clickupToken !== ''}`,
    userName: clickupUserName,
  }

  const styles = {
    parent: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#00383f',
      justifyContent: 'space-between',
    },
    header: {
      justifyContent: 'center',
      background: '#00383f',
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
      background: '#00383f',
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
        <img src={BraveLogoWhite} alt="Brave Logo" width="220px" />
      </div>
      <div style={styles.navi}>
        {Object.values(Pages).map(page => {
          if (page.loginBadge) {
            return (
              <LoginRowButton
                state={viewState}
                loginState={loginButtonConfig[page.displayName].loginState}
                userName={loginButtonConfig[page.displayName].userName}
                label={page.displayName}
                changeToken={loginButtonConfig[page.displayName].changeToken}
                link={page.paths[0]}
              />
            )
          }
          if (page.authorizations.clickup && page.authorizations.particle) {
            return (
              <RowButton
                label={page.displayName}
                state={viewState}
                enabled={loginStatus === 'true' && clickupToken !== ''}
                particle={loginStatus !== 'true'}
                clickup={clickupToken === ''}
                link={page.paths[0]}
              />
            )
          }
          if (page.authorizations.clickup) {
            return <RowButton label={page.displayName} state={viewState} enabled={clickupToken !== ''} clickup link={page.paths[0]} />
          }
          if (page.authorizations.particle) {
            return <RowButton label={page.displayName} state={viewState} enabled={loginStatus === 'true'} particle link={page.paths[0]} />
          }
          return <RowButton label={page.displayName} state={viewState} link={page.paths[0]} />
        })}
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
  googlePayload: PropTypes.shape({
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
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
