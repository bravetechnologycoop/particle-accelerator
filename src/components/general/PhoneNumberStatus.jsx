import { Badge, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'

/**
 * PhoneNumberStatus: React Component similar to StatusBadge. Returns a badge based on state to indicate status of Twilio phone number acquisition.
 *
 * States:
 *
 *  - status === 'none' returns nothing
 *
 *  - status === 'idle' returns grey badge with 'Waiting' as text
 *
 *  - status === 'notSelected' returns grey badge with 'Not Selected' as text
 *
 *  - status === 'fail' returns red badge with 'Failed' as text
 *
 *  - status === 'waiting' returns loading spinner
 *
 *  - status === (valid phone number) returns green badge with phone number as text
 *
 *  - status === else returns red badge with 'Error' as text
 *
 * @param {string} props.status the current status of phone number acquisition. Also is the phone number itself on successful acquiring.
 * @return {JSX.Element}
 */
function PhoneNumberStatus(props) {
  function checkValidPhoneNumber(phoneNumber) {
    const regex = /^\+[0-9]{11}$/
    return regex.test(phoneNumber)
  }

  const { status } = props
  if (status === 'none') {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>
  }
  if (status === 'idle') {
    return <Badge bg="secondary">Waiting</Badge>
  }
  if (status === 'waiting') {
    return <Spinner animation="border" />
  }
  if (checkValidPhoneNumber(status)) {
    return <Badge bg="success">{status}</Badge>
  }
  if (status === 'notSelected') {
    return <Badge bg="secondary">Not Selected</Badge>
  }
  if (status === 'fail') {
    return <Badge bg="danger">Failed</Badge>
  }
  return <Badge bg="danger">Error</Badge>
}

PhoneNumberStatus.propTypes = {
  status: PropTypes.string.isRequired,
}

export default PhoneNumberStatus
