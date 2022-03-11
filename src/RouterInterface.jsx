import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Navigation from './components/Navigation'
import Frame from './views/Frame'
import { getParticleLoginState, getParticleToken } from './utilities/StorageFunctions'

function RouterInterface(props) {
  const { viewState, changeViewState } = props

  const [token, setToken] = useState(getParticleToken())
  const [loginState, setLoginState] = useState(getParticleLoginState())

  function changeToken(newToken) {
    setToken(newToken)
  }

  function changeLoginState(newState) {
    setLoginState(newState)
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
        />
      </div>
      <div style={styles.main}>
        <Frame changeLoginState={changeLoginState} changeToken={changeToken} loginState={loginState} token={token} viewState={viewState} />
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
