import React from 'react'
import '../views/Navigation.css'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap'

/**
 * RowToggler: Toggle button for the Navigation Bar to toggle a state in the PA application.
 *
 * @param {string} props.label label for the button
 * @param {boolean} props.toggleState current state of toggle (hook)
 * @param {function} props.changeToggleState handler function for changing toggle state
 * @return {JSX.Element}
 * @constructor
 */
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
  label: PropTypes.string.isRequired,
  toggleState: PropTypes.bool.isRequired,
  changeToggleState: PropTypes.func.isRequired,
}

export default RowToggler
