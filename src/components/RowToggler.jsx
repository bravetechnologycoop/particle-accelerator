import React from 'react'
import '../views/Navigation.css'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap'

function RowToggler(props) {
  const { label, toggleState, changeToggleState } = props

  const styles = {
    parent: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  }

  function toggle(evt) {
    evt.preventDefault()
    if (toggleState) {
      changeToggleState(false)
    } else {
      changeToggleState(true)
    }
  }

  if (toggleState) {
    return (
      <button className="customLink" onClick={toggle} type="button">
        <div style={styles.parent}>
          {label}{' '}
          <div style={{ paddingLeft: '1ch' }}>
            <Badge bg="success">On</Badge>
          </div>
        </div>
      </button>
    )
  }
  return (
    <button className="customLink" onClick={toggle} type="button">
      <div style={styles.parent}>
        {label}{' '}
        <div style={{ paddingLeft: '1ch' }}>
          <Badge bg="danger">Off</Badge>
        </div>
      </div>
    </button>
  )
}

RowToggler.propTypes = {
  label: PropTypes.string,
  toggleState: PropTypes.bool,
  changeToggleState: PropTypes.func,
}

RowToggler.defaultProps = {
  label: '',
  toggleState: true,
  changeToggleState: () => {},
}

export default RowToggler
