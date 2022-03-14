import './Navigation.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import React from 'react'

function RowButton(props) {
  const { label, state, enabled } = props

  const webLink = label.replace(/\s+/g, '-').toLowerCase()

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
    <Link to={`/${webLink}`} className={style}>
      {label}
    </Link>
  )
}

RowButton.propTypes = {
  label: PropTypes.string,
  state: PropTypes.string,
  enabled: PropTypes.bool,
}

RowButton.defaultProps = {
  label: '',
  state: '',
  enabled: true,
}

export default RowButton
