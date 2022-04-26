import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Badge, ButtonGroup, Card, Form, ToggleButton } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import ActivatedDevice from '../utilities/ActivatedDevice'
import DoorSensorEntryCard from '../components/DoorSensorEntryCard'
import { copyActivatedDevices } from '../utilities/StorageFunctions'
import { getDeviceDetails } from '../utilities/ParticleFunctions'
import ParticleSettings from '../utilities/ParticleSettings'
import ClickupStatuses from '../utilities/ClickupStatuses'

function DoorSensorView(props) {
  // eslint-disable-next-line no-unused-vars
  const { activatedDevices, changeActivatedDevices, particleToken, particleSettings, clickupToken, clickupListID } = props

  const DEFAULT_TIMEOUT_INTERVAL = 10000
  const blankActivatedDevice = ActivatedDevice.BlankDevice()

  const [updateInterval, setUpdateInterval] = useState(DEFAULT_TIMEOUT_INTERVAL)
  const [pairingStatuses, setPairingStatuses] = useState({})

  const [selectorState, setSelectorState] = useState('searchSerial')
  const [foundDevice, setFoundDevice] = useState(blankActivatedDevice)
  const [searchState, setSearchState] = useState('idle')
  const [productID, setProductID] = useState('')
  const [serialNumber, setSerialNumber] = useState('')

  function changeProductID(newID) {
    setProductID(newID)
  }

  function changeSerialNumber(newSerialNumber) {
    setSerialNumber(newSerialNumber)
  }

  function changeSearchState(state) {
    setSearchState(state)
  }

  function changeFoundDevice(device) {
    setFoundDevice(device)
  }

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
    console.log('field: ', field, 'new value: ', newValue)
    const copyOfActivatedDevices = copyActivatedDevices(activatedDevices)
    const targetIndex = copyOfActivatedDevices.findIndex(device => device.deviceID === deviceID)
    copyOfActivatedDevices[targetIndex][field] = newValue
    changeActivatedDevices(copyOfActivatedDevices)
  }

  function pushDevice(newDevice) {
    const newDeviceArray = [newDevice]
    const updatedList = newDeviceArray.concat(activatedDevices)
    changeActivatedDevices(updatedList)
  }

  function submitDeviceHandler(device, doorSensorID) {
    let targetDevice
    if (selectorState === 'select') {
      targetDevice = device
    } else {
      const matchingDevices = activatedDevices.filter(activatedDevice => {
        return activatedDevice.deviceID === device.deviceID
      })
      console.log('matching devices length: ', matchingDevices.length)
      if (matchingDevices.length === 0) {
        pushDevice(device)
        targetDevice = device
      } else {
        targetDevice = matchingDevices[0]
      }
    }
    addNewPairingStatus(targetDevice.deviceName)
    targetDevice.pairDoorSensor(
      particleToken,
      doorSensorID,
      updateInterval,
      changeDevicePairingState,
      modifyActivatedDevice,
      clickupToken,
      clickupListID,
    )
  }

  function handleToggle(x) {
    setSelectorState(x.target.value)
    setProductID('')
    setSerialNumber('')
    setFoundDevice(blankActivatedDevice)
    setSearchState('idle')
  }

  const styles = {
    parent: {
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
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
      overflowY: 'scroll',
    },
    toggleButton: {
      fontSize: 'small',
    },
  }

  return (
    <div style={styles.parent}>
      <div style={styles.column}>
        <h3>Select Device</h3>
        <hr />
        <div style={styles.scrollView}>
          {activatedDevices
            .filter(device => {
              return device.clickupStatus === ClickupStatuses.activation.name
            })
            .map(device => {
              return (
                <DoorSensorEntryCard
                  searchState={searchState}
                  submitDeviceHandler={submitDeviceHandler}
                  device={device}
                  selectorState={selectorState}
                  key={device.clickupTaskID}
                />
              )
            })}
        </div>
      </div>
      <div style={styles.column}>
        <h3>Queue</h3>
        <hr />
        <div style={styles.scrollView}>
          {activatedDevices
            .filter(device => {
              return device.inPairingList
            })
            .map(device => {
              return (
                <li style={{ paddingTop: '0.1ch', paddingBottom: '0.2ch', listStyle: 'none' }} key={`${device.dateStamp}${device.timeStamp}`}>
                  <DoorSensorQueueCard device={device} status={pairingStatuses[device.deviceID]} reactStateHandler={modifyActivatedDevice} />
                </li>
              )
            })}
        </div>
      </div>
      <div style={styles.column}>
        <div>
          <h3>Successful Pairings</h3>
          <hr />
          <div style={styles.scrollView}>
            {activatedDevices
              .filter(device => {
                return device.doorSensorID !== '' && device.doorSensorID !== null && device.doorSensorID !== undefined
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
    </div>
  )
}

DoorSensorView.propTypes = {
  activatedDevices: PropTypes.arrayOf(PropTypes.instanceOf(ActivatedDevice)).isRequired,
  changeActivatedDevices: PropTypes.func.isRequired,
  particleToken: PropTypes.string.isRequired,
  particleSettings: PropTypes.instanceOf(ParticleSettings).isRequired,
  clickupToken: PropTypes.string.isRequired,
  clickupListID: PropTypes.string.isRequired,
}

function DoorSensorQueueCard(props) {
  const { device, status, reactStateHandler } = props
  if (status === 'paired') {
    return (
      <Card key={`${device.dateStamp}${device.timeStamp}`}>
        <Card.Body>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <h5 style={{ paddingRight: '10px' }}>{device.deviceName}</h5>
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
          <h5 style={{ paddingRight: '10px' }}>{device.deviceName}</h5>
          <QueueStatusBadge status={status} />
        </div>
        <Button
          onClick={() => device.stopPairing(reactStateHandler)}
          type="button"
          variant="danger"
          style={{ fontSize: 'small', paddingTop: '10px' }}
        >
          Stop Pairing
        </Button>
      </Card.Body>
    </Card>
  )
}

DoorSensorQueueCard.propTypes = {
  device: PropTypes.instanceOf(ActivatedDevice).isRequired,
  status: PropTypes.string.isRequired,
  reactStateHandler: PropTypes.func,
}

DoorSensorQueueCard.defaultProps = {
  reactStateHandler: () => {},
}

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

export default DoorSensorView
