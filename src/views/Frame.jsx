import PropTypes from 'prop-types'
import React, { useState } from 'react'
import ActivatorView from './ActivatorView'
import Validator from '../components/Validator'
import LoginView from './LoginView'
import ClickupLogin from './ClickupLogin'
import ActivationHistory from './ActivationHistory'
import { getActivationHistory } from '../utilities/StorageFunctions'

function Frame(props) {
  const { token, changeToken, loginState, changeLoginState, viewState } = props

  const [activationHistory, setActivationHistory] = useState(getActivationHistory())

  function changeActivationHistory(newHistory) {
    setActivationHistory(newHistory)
  }

  const styles = {
    main: {
      overflow: 'auto',
    },
  }

  if (viewState === 'Activator') {
    return (
      <div style={styles.main}>
        <ActivatorView
          token={token}
          changeToken={changeToken}
          activationHistory={activationHistory}
          changeActivationHistory={changeActivationHistory}
        />
      </div>
    )
  }
  if (viewState === 'Validator') {
    return (
      <div style={styles.main}>
        <Validator token={token} changeToken={changeToken} />
      </div>
    )
  }
  if (viewState === 'Particle') {
    return (
      <div style={styles.main}>
        <LoginView loginState={loginState} changeLoginState={changeLoginState} changeToken={changeToken} token={token} />
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
  return (
    <div style={styles.main}>
      <h1>home</h1>
      <h3>{process.env.NODE_ENV}</h3>
    </div>
  )
}

Frame.propTypes = {
  token: PropTypes.string,
  changeToken: PropTypes.func,
  loginState: PropTypes.string,
  changeLoginState: PropTypes.func,
  viewState: PropTypes.string,
}

Frame.defaultProps = {
  token: '',
  changeToken: () => {},
  loginState: 'false',
  changeLoginState: () => {},
  viewState: 'Home',
}

export default Frame
