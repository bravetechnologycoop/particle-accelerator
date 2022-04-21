import './Navigation.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import LoginStatus from './LoginStatus'
import ClickupLogo from './clickupLogo.svg'
import ParticleLogo from './particleLogo.svg'

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
            <img src={ClickupLogo} alt="Clickup Logo" style={{ height: '1.5em', paddingRight: '1ch' }} />
            <img src={ParticleLogo} alt="Particle Logo" style={{ height: '1.5em', paddingRight: '1ch' }} />
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
  label: PropTypes.string,
  state: PropTypes.string,
  enabled: PropTypes.bool,
  clickup: PropTypes.bool,
  particle: PropTypes.bool,
}

RowButton.defaultProps = {
  label: '',
  state: '',
  enabled: true,
  clickup: false,
  particle: false,
}

export default RowButton
