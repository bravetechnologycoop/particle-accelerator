import './Navigation.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import React from 'react'
import LoginStatus from './LoginStatus'
import ParticleSettings from '../utilities/ParticleSettings'

function LoginRowButton(props) {
  const { label, state, enabled, loginState, userName } = props

  const styles = {
    parent: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  }

  const lowercaseLabel = label.toLowerCase()

  let style

  if (state === label) {
    style = 'activeLink'
  } else {
    style = 'customLink'
  }

  if (!enabled) {
    style = 'disabledLink'
  }

  return (
    <Link to={`/${lowercaseLabel}`} className={style}>
      <div style={styles.parent}>
        {label}{' '}
        <div style={{ paddingLeft: '1ch' }}>
          <LoginStatus loginState={loginState} userName={userName} />
        </div>
      </div>
    </Link>
  )
}

LoginRowButton.propTypes = {
  label: PropTypes.string,
  state: PropTypes.string,
  enabled: PropTypes.bool,
  loginState: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  changeToken: PropTypes.func,
  userName: PropTypes.string,
}

LoginRowButton.defaultProps = {
  label: '',
  state: '',
  enabled: true,
  loginState: 'false',
  changeToken: () => {},
  userName: '',
}

export default LoginRowButton
