import { Badge, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'

function PhoneNumberStatus(props) {
  function checkValidPhoneNumber(phoneNumber) {
    const regex = /^\+[0-9]{11}$/
    return regex.test(phoneNumber)
  }

  const { status } = props
  if (status === 'idle') {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>
  }
  if (status === 'waiting') {
    return <Spinner animation="border" />
  }
  if (checkValidPhoneNumber(status)) {
    return <Badge bg="success">{status}</Badge>
  }
  return <Badge bg="danger">Error</Badge>
}

PhoneNumberStatus.propTypes = {
  status: PropTypes.string.isRequired,
}

export default PhoneNumberStatus
