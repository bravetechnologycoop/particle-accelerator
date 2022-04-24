import Button from 'react-bootstrap/Button'
import { Badge } from 'react-bootstrap'
import React from 'react'
import DeviceIDStatus from './DeviceIDStatus'
import ICCIDStatus from './ICCIDStatus'
import StatusBadge from './StatusBadge'

// CSS Styles
const styles = {
  main: {
    alignItems: 'top',
    display: 'flex',
    flexDirection: 'column',
  },
  child: {
    padding: 10,
  },
  scrollView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'top',
    overflow: 'auto',
  },
}

/**
 * StatusBoard: React Component for displaying all of the statuses of the current stages of the activation process.
 *
 * @param {boolean} props.status boolean for whether a first activation has taken place yet or not.
 * @param {string} props.deviceID the current state of deviceID acquisition or the actual deviceID.
 * @param {string} props.iccid the current state of iccid acquisition or the actual iccid
 * @param {string} props.activationStatus the current state of SIM activation status
 * @param {string} props.renameStatus the current status of renaming the Particle device
 * @param {string} props.totalStatus the current status of the device activation validation process.
 * @param {function} props.handleSubmit handler function for handling the form submission process
 * @param {function} props.resetDefaults function for resetting the form to a default state
 * @param {string} props.serialNumber the user-inputted device serial number
 * @param {string} props.newDeviceName the user-inputted name for the device
 */
function StatusBoard(props) {
  // eslint-disable-next-line react/destructuring-assignment,react/prop-types
  const { status, deviceID, iccid, activationStatus, renameStatus, totalStatus, handleSubmit, resetDefaults, serialNumber, newDeviceName } = props
  return (
    <div style={styles.main}>
      <div>
        <h3>Current Activation Progress</h3>
        <hr />
      </div>
      <div style={styles.scrollView}>
        <div style={styles.child}>
          <h5>Device Information:</h5>
          Device Serial Number: <Badge bg="primary">{serialNumber}</Badge>
          <br />
          New Device Name: <Badge bg="primary">{newDeviceName}</Badge>
        </div>
        <div style={styles.child}>
          Device ID: <DeviceIDStatus deviceID={deviceID} />
          <br />
          ICCID: <ICCIDStatus iccid={iccid} />
        </div>

        <div style={styles.child}>
          <h5>SIM Activation:</h5>
          Status: <StatusBadge status={activationStatus} />
        </div>

        <div style={styles.child}>
          <h5>Device Naming:</h5>
          Status: <StatusBadge status={renameStatus} />
        </div>

        <div style={styles.child}>
          <h5>Activation Verification:</h5>
          Status: <StatusBadge status={totalStatus} />
        </div>

        <div style={styles.child}>
          <Button variant="primary" onClick={resetDefaults} disabled={!status}>
            Next Device
          </Button>
          <Button variant="warning" onClick={handleSubmit} disabled={!status}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StatusBoard
