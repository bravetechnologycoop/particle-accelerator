import { Badge } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'

/**
 * ValueBadge: Generic badge for displaying states and values
 *
 * States:
 *  - value === 'idle' -> Colour: yellow | Text: 'Waiting'
 *  - value === '' -> Colour: red | Text: 'Error'
 *  - value === 'false' -> Colour: red | Text: 'False'
 *  - value === 'never online' -> Colour: red | Text: 'Never Online'
 *  - value === 'none' -> Colour: red | Text: 'None'
 *  - value === 'not found' -> Colour: red | Text: 'Device Not Found'
 *  - value === else -> Colour: (bg === 'true' || else -> green, bg === 'false' -> red) Text: {props.value}
 *
 * @param {string} props.value value or state to display
 * @param {string} props.bg forced background style for values not recognized in props.value
 * @return {JSX.Element}
 */
function ValueBadge(props) {
  const { value, bg } = props
  let localStyle = bg

  if (localStyle === 'true') {
    localStyle = 'success'
  } else if (localStyle === 'false') {
    localStyle = 'danger'
  }

  if (value === 'idle') {
    return <Badge bg="secondary">Waiting</Badge>
  }
  if (value === '') {
    return <Badge bg="danger">Error</Badge>
  }
  if (value === 'false') {
    return <Badge bg="danger">False</Badge>
  }
  if (value === 'true') {
    return <Badge bg="success">True</Badge>
  }
  if (value === 'never online') {
    return <Badge bg="danger">Never Online</Badge>
  }
  if (value === 'none') {
    return <Badge bg="danger">None</Badge>
  }
  if (value === 'not found') {
    return <Badge bg="danger">Device Not Found</Badge>
  }
  if (localStyle !== '') {
    return <Badge bg={localStyle}>{value}</Badge>
  }
  return <Badge bg="success">{value}</Badge>
}

ValueBadge.propTypes = {
  value: PropTypes.string,
  bg: PropTypes.string,
}

ValueBadge.defaultProps = {
  value: '',
  bg: '',
}

export default ValueBadge
