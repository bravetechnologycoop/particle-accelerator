import { Badge } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'

function QueueStatusBadge(props) {
  const { status } = props

  if (status === 'idle') {
    return <Badge bg="secondary">Waiting</Badge>
  }
  if (status === 'onlineCheck') {
    return <Badge bg="primary">Checking Connection</Badge>
  }
  if (status === 'firmwareCheck') {
    return <Badge bg="primary">Checking Firmware</Badge>
  }
  if (status === 'idleOnline') {
    return <Badge bg="warning">Waiting For Firmware</Badge>
  }
  if (status === 'fail') {
    return <Badge bg="danger">Pairing Failed</Badge>
  }
  if (status === 'paired') {
    return <Badge bg="success">Successfully Paired</Badge>
  }
  if (status === 'attemptingPairing') {
    return <Badge bg="primary">Attempting to Pair</Badge>
  }
  if (status === 'idleNoPair') {
    return <Badge bg="warning">Idle: Pairing Unsuccessful</Badge>
  }
  if (status === 'idleNoFirmware') {
    return <Badge bg="secondary">Idle: Firmware Not Present</Badge>
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>
}

QueueStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
}

export default QueueStatusBadge
