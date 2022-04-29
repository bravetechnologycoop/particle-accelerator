import { Badge, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'

export default function RegistrationIcon(props) {
  const { status } = props

  if (status === 'waiting') {
    return <Spinner animation="border" />
  }
  if (status === 'success') {
    return <Badge bg="success">Success</Badge>
  }
  if (status.includes('Error')) {
    return <Badge bg="danger">{status}</Badge>
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>
}

RegistrationIcon.propTypes = {
  status: PropTypes.string.isRequired,
}
