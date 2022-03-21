import React, { useState } from 'react'
import { Badge, ButtonGroup, Card, Form, ToggleButton } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import ParticleSettings from '../utilities/ParticleSettings'
import DoorSensorLabel from '../pdf/DoorSensorLabel'
import MainSensorLabel from '../pdf/MainSensorLabel'
import ActivatedDevice from '../utilities/ActivatedDevice'
import RenamerDeviceRow from '../components/RenamerDeviceRow'

function RenamerView(props) {
  const { particleSettings, activatedDevices } = props

  const blankActivatedDevice = new ActivatedDevice('', '', '', '', '', '', '', '')

  const [productID, setProductID] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [selectedDevice, setSelectedDevice] = useState(blankActivatedDevice)
  const [locationID, setLocationID] = useState('')
  const [selectorState, setSelectorState] = useState('searchSerial')

  function changeLocationID(newLocationID) {
    setLocationID(newLocationID)
  }

  function changeSelectedDevice(newDevice) {
    setSelectedDevice(newDevice)
    setProductID(newDevice.productID)
    setSerialNumber(newDevice.serialNumber)
  }

  function changeProductID(newProductID) {
    setProductID(newProductID)
  }

  function changeSerialNumber(newSerialNumber) {
    setSerialNumber(newSerialNumber)
  }

  async function handleRenameSubmit(event) {
    event.preventDefault()
  }

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
      paddingTop: '20px',
    },
    expandedColumn: {
      flex: '2 2 50%',
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingTop: '20px',
    },
    toggleButton: {
      fontSize: 'small',
    },
  }

  function handleToggle(x) {
    setSelectorState(x.target.value)
    setProductID('')
    setSerialNumber('')
    setSelectedDevice(blankActivatedDevice)
  }

  return (
    <>
      <h1 style={{ paddingLeft: '20px' }}>Renamer</h1>
      <div style={styles.parent}>
        <div style={styles.column}>
          <h3>Select Device</h3>
          <hr />
          <ButtonGroup style={{ paddingBottom: '15px' }}>
            <ToggleButton
              value="searchSerial"
              id="searchSerial"
              type="radio"
              key={0}
              variant="outline-secondary"
              checked={selectorState === 'searchSerial'}
              onChange={x => {
                handleToggle(x)
              }}
              style={styles.toggleButton}
            >
              Find by Serial Number
            </ToggleButton>
            <ToggleButton
              value="searchSensor"
              id="searchSensor"
              key={2}
              type="radio"
              variant="outline-secondary"
              checked={selectorState === 'searchSensor'}
              onChange={x => handleToggle(x)}
              style={styles.toggleButton}
            >
              Find by Sensor Number
            </ToggleButton>
            <ToggleButton
              value="select"
              id="select"
              key={1}
              type="radio"
              variant="outline-secondary"
              checked={selectorState === 'select'}
              onChange={x => handleToggle(x)}
              style={styles.toggleButton}
            >
              Select from Activated Devices
            </ToggleButton>
          </ButtonGroup>
          <DeviceSelector
            selectorState={selectorState}
            selectedDevice={selectedDevice}
            serialNumber={serialNumber}
            productID={productID}
            particleSettings={particleSettings}
            activatedDevices={activatedDevices}
            changeSerialNumber={changeSerialNumber}
            changeSelectedDevice={changeSelectedDevice}
            changeProductID={changeProductID}
          />
        </div>
        <div style={styles.expandedColumn}>
          <h3>In Progress</h3>
          <hr />
          <Card>
            <Card.Header>Device Rename Configuration</Card.Header>
            <Card.Body>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <h6>Current Device Name: </h6>{' '}
                <h6 style={{ paddingLeft: '5px' }}>
                  <Badge bg="primary">{selectedDevice.deviceName}</Badge>
                </h6>
              </div>
              <Form onSubmit={handleRenameSubmit}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                  <h6 style={{ paddingRight: '5px' }}>New Device Name (Location ID): </h6>
                  <Form.Group>
                    <Form.Control value={locationID} onChange={x => changeLocationID(x.target.value)} />
                  </Form.Group>
                </div>
                <Form.Check type="checkbox" id="default-checkbox" label="Rename on Particle" />
                <Form.Check type="checkbox" id="default-checkbox" label="Rename on ClickUp" />
                <Form.Check type="checkbox" id="default-checkbox" label="Register to Dashboard" />
                <Form.Check type="checkbox" id="default-checkbox" label="Purchase and Register Twilio Number" />
                <div style={{ paddingTop: '10px' }}>
                  <Button type="submit">Rename Device</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
            <MainSensorLabel locationID={locationID} sensorNumber={selectedDevice.deviceName.replace(/[^0-9]*/, '')} />
            <DoorSensorLabel locationID={locationID} sensorNumber={selectedDevice.deviceName.replace(/[^0-9]*/, '')} />
          </div>
        </div>
        <div style={styles.column}>
          <h3>Completed</h3>
          <hr />
        </div>
      </div>
    </>
  )
}

RenamerView.propTypes = {
  particleSettings: PropTypes.instanceOf(ParticleSettings).isRequired,
  activatedDevices: PropTypes.arrayOf(PropTypes.instanceOf(ActivatedDevice)).isRequired,
}

function DeviceSelector(props) {
  const {
    selectorState,
    selectedDevice,
    changeSelectedDevice,
    serialNumber,
    changeSerialNumber,
    productID,
    changeProductID,
    particleSettings,
    activatedDevices,
  } = props

  function handleSearchSubmit(event) {
    event.preventDefault()
  }

  if (selectorState === 'searchSerial') {
    return (
      <>
        <h4>Search Device</h4>
        <Form onSubmit={handleSearchSubmit}>
          <Form.Group className="mb-3" controlId="formProductSelect">
            <Form.Label>Select Device Product Family</Form.Label>
            <Form.Control
              as="select"
              value={productID}
              onChange={x => {
                changeProductID(x.target.value)
              }}
            >
              <option id="">No Product Family</option>
              {/* eslint-disable-next-line react/prop-types */}
              {particleSettings.productList.map(product => {
                return (
                  <option key={`${product.id}`} id={`${product.id}`} value={`${product.id}`}>
                    {`${product.id}`.concat(': ', product.name, ' (', product.deviceType, ')')}
                  </option>
                )
              })}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDeviceID">
            <Form.Label>Device Serial Number</Form.Label>
            <Form.Control placeholder="Serial Number" value={serialNumber} maxLength="15" onChange={x => changeSerialNumber(x.target.value)} />
            <Form.Text className="text-muted">This is retrieved by scanning the barcode on the particle device.</Form.Text>
          </Form.Group>

          <Button variant="outline-primary" type="submit">
            Search
          </Button>
        </Form>
      </>
    )
  }
  if (selectorState === 'select') {
    return (
      <>
        <h4 style={{ paddingTop: '20px' }}>Select From Activated Devices</h4>
        <div style={{ overflowY: 'scroll' }}>
          {activatedDevices.map(device => {
            return (
              <li key={`${device.timeStamp}${device.dateStamp}`} style={{ listStyle: 'none', paddingTop: '0.3em', paddingBottom: '0.3em' }}>
                <RenamerDeviceRow device={device} currentDevice={selectedDevice} changeCurrentDevice={changeSelectedDevice} />
              </li>
            )
          })}
        </div>
      </>
    )
  }
  if (selectorState === 'searchSensor') {
    return <h1>sensor search</h1>
  }
  return <h2>top text</h2>
}

DeviceSelector.propTypes = {
  selectorState: PropTypes.string.isRequired,
  selectedDevice: PropTypes.instanceOf(ActivatedDevice).isRequired,
  changeSelectedDevice: PropTypes.func,
  serialNumber: PropTypes.string.isRequired,
  changeSerialNumber: PropTypes.func,
  productID: PropTypes.string.isRequired,
  changeProductID: PropTypes.func,
  particleSettings: PropTypes.instanceOf(ParticleSettings).isRequired,
  activatedDevices: PropTypes.arrayOf(PropTypes.instanceOf(ActivatedDevice)).isRequired,
}

DeviceSelector.defaultProps = {
  changeSelectedDevice: () => {},
  changeSerialNumber: () => {},
  changeProductID: () => {},
}

export default RenamerView
