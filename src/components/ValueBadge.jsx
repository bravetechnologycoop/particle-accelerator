import { Badge } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'

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
