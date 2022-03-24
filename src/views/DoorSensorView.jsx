import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Badge, Card } from 'react-bootstrap'
import ActivatedDevice from '../utilities/ActivatedDevice'
import DoorSensorEntryCard from '../components/DoorSensorEntryCard'
import { copyActivatedDevices } from '../utilities/StorageFunctions'

function DoorSensorView(props) {
  // eslint-disable-next-line no-unused-vars
  const { activatedDevices, changeActivatedDevices, token } = props

  const DEFAULT_TIMEOUT_INTERVAL = 5000

  const [updateInterval, setUpdateInterval] = useState(DEFAULT_TIMEOUT_INTERVAL)
  const [pairingStatuses, setPairingStatuses] = useState({})
  const [counter, setCounter] = useState(0)

  function addNewPairingStatus(deviceID) {
    const copyOfPairingStatuses = JSON.parse(JSON.stringify(pairingStatuses))
    copyOfPairingStatuses[deviceID] = 'idle'
    setPairingStatuses(copyOfPairingStatuses)
  }

  function changeDevicePairingState(deviceID, newStatus) {
    const copyOfPairingStatuses = JSON.parse(JSON.stringify(pairingStatuses))
    copyOfPairingStatuses[deviceID] = newStatus
    setPairingStatuses(copyOfPairingStatuses)
  }

  function modifyActivatedDevice(deviceID, field, newValue) {
    const copyOfActivatedDevices = copyActivatedDevices(activatedDevices)
    const targetIndex = copyOfActivatedDevices.findIndex(device => device.deviceID === deviceID)
    copyOfActivatedDevices[targetIndex][field] = newValue
    changeActivatedDevices(copyOfActivatedDevices)
  }

  function submitDeviceHandler(device, doorSensorID) {
    addNewPairingStatus(device.deviceName)
    device.pairDoorSensor(token, doorSensorID, updateInterval, changeDevicePairingState, modifyActivatedDevice)
  }

  useEffect(() => {
    console.log('pairing statuses: ', pairingStatuses)
    console.log(activatedDevices)
  })

  /* useEffect(() => {
    return () => {
      storeActivatedDevices(activatedDevices)
      const copiedActivatedDevices = getActivatedDevices()
      changeActivatedDevices(copiedActivatedDevices)
    }
  }, activatedDevices) */

  const styles = {
    parent: {
      display: 'flex',
      flexDirection: 'row',
    },
    column: {
      flex: '1 1 33%',
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: '20px',
      paddingRight: '20px',
    },
    checkerBox: {
      flex: '1 1 25vh',
    },
    queueBox: {
      flex: '1 1 75vh',
    },
    scrollView: {
      overflowY: 'auto',
    },
  }

  return (
    <div style={styles.parent}>
      <div style={styles.column}>
        <div>
          <h3>Activated Devices</h3>
          <hr />
        </div>
        <div style={styles.scrollView}>
          {activatedDevices.map(device => {
            return (
              <li style={{ paddingTop: '0.1ch', paddingBottom: '0.2ch', listStyle: 'none' }} key={`${device.dateStamp}${device.timeStamp}`}>
                <DoorSensorEntryCard device={device} submitDeviceHandler={submitDeviceHandler} />
              </li>
            )
          })}
        </div>
      </div>
      <div style={styles.column}>
        <h3>Queue</h3>
        <hr />
        {activatedDevices
          .filter(device => {
            return device.inPairingList
          })
          .map(device => {
            return (
              <li style={{ paddingTop: '0.1ch', paddingBottom: '0.2ch', listStyle: 'none' }} key={`${device.dateStamp}${device.timeStamp}`}>
                <DoorSensorQueueCard device={device} status={pairingStatuses[device.deviceID]} />
              </li>
            )
          })}
      </div>
      <div style={styles.column}>
        <div>
          <h3>Successful Pairings</h3>
          <hr />
          {activatedDevices
            .filter(device => {
              return device.doorSensorID !== '' && device.doorSensorID !== null
            })
            .map(device => {
              return (
                <li style={{ paddingTop: '0.1ch', paddingBottom: '0.2ch', listStyle: 'none' }} key={`${device.dateStamp}${device.timeStamp}`}>
                  <DoorSensorQueueCard device={device} status="paired" />
                </li>
              )
            })}
        </div>
      </div>
    </div>
  )
}

DoorSensorView.propTypes = {
  activatedDevices: PropTypes.arrayOf(PropTypes.instanceOf(ActivatedDevice)),
  changeActivatedDevices: PropTypes.func,
  token: PropTypes.string.isRequired,
}

DoorSensorView.defaultProps = {
  activatedDevices: new ActivatedDevice(),
  changeActivatedDevices: () => {},
}

function DoorSensorQueueCard(props) {
  const { device, status } = props
  if (status === 'paired') {
    return (
      <Card key={`${device.dateStamp}${device.timeStamp}`}>
        <Card.Body>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <h5>{device.deviceName}</h5>
            <QueueStatusBadge status={status} />
          </div>
          {device.doorSensorID}
        </Card.Body>
      </Card>
    )
  }
  return (
    <Card key={`${device.dateStamp}${device.timeStamp}`}>
      <Card.Body>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <h5>{device.deviceName}</h5>
          <QueueStatusBadge status={status} />
        </div>
      </Card.Body>
    </Card>
  )
}

DoorSensorQueueCard.propTypes = {
  device: PropTypes.instanceOf(ActivatedDevice).isRequired,
  status: PropTypes.string.isRequired,
}

function QueueStatusBadge(props) {
  const { status } = props

  useEffect(() => {
    console.log('status badge status: ', status)
  })

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

export default DoorSensorView
