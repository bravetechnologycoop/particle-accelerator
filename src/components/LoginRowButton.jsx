import './Navigation.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import React from 'react'
import LoginStatus from './LoginStatus'

function LoginRowButton(props) {
  const { label, state, enabled, loginState, token } = props

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
          <LoginStatus loginState={loginState} token={token} />
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
  token: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  changeToken: PropTypes.func,
}

LoginRowButton.defaultProps = {
  label: '',
  state: '',
  enabled: true,
  loginState: 'false',
  token: '',
  changeToken: () => {},
}

export default LoginRowButton
