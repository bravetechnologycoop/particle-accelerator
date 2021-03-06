import { Badge } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'

/**
 * Checks that the deviceID is valid based on a regex expression (contains
 * only hex characters and is 24 characters in length).
 * @param deviceID
 * @return true if the deviceID is valid, false if not.
 */
function checkValidDeviceID(deviceID) {
  const regex = /^[0-9|a-f]{24}$/
  return regex.test(deviceID)
}

/**
 * React component for displaying the current status of acquiring
 * a DeviceID. Outputs a badge with either the current status of ID acquisition
 * or a badge with the DeviceID if a valid DeviceID is returned.
 *
 * Possible States:
 *
 *  - 'idle': Returns a grey badge with text 'Waiting'
 *
 *  - 'waiting': Returns a yellow badge with text 'In Progress'
 *
 *  - Valid DeviceID: Returns a green badge with the DeviceID
 *
 *  - else: Returns a red badge with text 'Error in Acquiring DeviceID'
 *
 *  @param {string} props.deviceID the current state or deviceID of the current activating device.
 */
function DeviceIDStatus(props) {
  const { deviceID } = props
  if (deviceID === 'idle') {
    return <Badge bg="secondary">Waiting</Badge>
  }
  if (deviceID === 'waiting') {
    return <Badge bg="warning">In Progress</Badge>
  }
  if (checkValidDeviceID(deviceID)) {
    return <Badge bg="success">{deviceID}</Badge>
  }
  return <Badge bg="danger">Error in Acquiring Device ID</Badge>
}

DeviceIDStatus.propTypes = {
  deviceID: PropTypes.string.isRequired,
}

export default DeviceIDStatus
