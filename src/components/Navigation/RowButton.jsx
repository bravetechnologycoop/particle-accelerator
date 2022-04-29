import '../../stylesheets/Navigation.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import React from 'react'
import ClickupLogo from '../../graphics/ClickupLogo.svg'
import ParticleLogo from '../../graphics/ParticleLogo.svg'

/**
 * RowButton: React component for the Navigation Bar which shows a page in the PA and links to it. Changes styling based
 * on current page. If the link is disabled, the component can display a clickup or particle logo to indicate why the
 * page is disabled.
 *
 * @param {string} props.label (required) Corresponding page title based on congruency with kebab-cased site url
 * @param {string} props.state (required) The current state of the app which the Frame is in.
 * @param {boolean} props.enabled Whether the link is enabled or not (default true)
 * @param {boolean} props.clickup Whether the ClickUp logo should be displayed when disabled. (default false)
 * @param {boolean} props.particle Whether the Particle logo should be displayed when disabled. (default false)
 *
 * @return {JSX.Element}
 */
function RowButton(props) {
  const { label, state, enabled, clickup, particle } = props

  const webLink = label.replace(/\s+/g, '-').toLowerCase()

  const styles = {
    parent: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  }

  let style

  if (state === label) {
    style = 'activeLink'
  } else {
    style = 'customLink'
  }

  if (!enabled) {
    style = 'disabledLink'
  }

  if (!enabled && clickup && particle) {
    return (
      <Link to={`/${webLink}`} className={style}>
        <div style={styles.parent}>
          {label}{' '}
          <div style={{ paddingLeft: '1ch', display: 'flex', flexDirection: 'row', justifyContent: 'right', alignItems: 'center' }}>
            <img src={ParticleLogo} alt="Particle Logo" style={{ height: '1.5em', paddingRight: '1ch' }} />
            <img src={ClickupLogo} alt="Clickup Logo" style={{ height: '1.5em', paddingRight: '1ch' }} />
          </div>
        </div>
      </Link>
    )
  }

  if (!enabled && clickup) {
    return (
      <Link to={`/${webLink}`} className={style}>
        <div style={styles.parent}>
          {label}{' '}
          <div style={{ paddingLeft: '1ch', display: 'flex', flexDirection: 'row', justifyContent: 'right', alignItems: 'center' }}>
            <img src={ClickupLogo} alt="Clickup Logo" style={{ height: '1.5em', paddingRight: '1ch' }} />
          </div>
        </div>
      </Link>
    )
  }

  if (!enabled && particle) {
    return (
      <Link to={`/${webLink}`} className={style}>
        <div style={styles.parent}>
          {label}{' '}
          <div style={{ paddingLeft: '1ch', display: 'flex', flexDirection: 'row', justifyContent: 'right', alignItems: 'center' }}>
            <img src={ParticleLogo} alt="Particle Logo" style={{ height: '1.5em', paddingRight: '1ch' }} />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/${webLink}`} className={style}>
      {label}{' '}
    </Link>
  )
}

RowButton.propTypes = {
  label: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  enabled: PropTypes.bool,
  clickup: PropTypes.bool,
  particle: PropTypes.bool,
}

RowButton.defaultProps = {
  enabled: true,
  clickup: false,
  particle: false,
}

export default RowButton
