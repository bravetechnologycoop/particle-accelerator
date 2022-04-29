import '../../stylesheets/Navigation.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import React from 'react'
import LoginStatus from '../ParticleLogin/LoginStatus'

/**
 * LoginRowButton
 *
 * React component designed for the navigation bar to allow for page navigation, but also displays a login status.
 * Shows the user's username/workspace name on successful login. Uses the "StatusBadge.jsx" component.
 *
 * Use Examples: ClickUp//Particle
 *
 * @param {string} props.label Text to display on the button in the Navigation Bar, must be congruent with the kebab-case url.
 * @param {string} props.state Selection state of the NavBar
 * @param {boolean} props.enabled Whether the button is active (clickable) or not.
 * @param {string} props.loginState State of login for the desired service
 * @param {string} props.userName The username to display on successful login (usually a hook that changes once a username is acquired from an external resource)
 * @return {JSX.Element}
 */
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
