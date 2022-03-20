import React, { useState } from 'react'
import { Card, Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import { BsFillArrowRightSquareFill } from 'react-icons/bs'
import { IconContext } from 'react-icons'
import ParticleSettings from '../utilities/ParticleSettings'
import DoorSensorLabel from '../pdf/DoorSensorLabel'
import MainSensorLabel from '../pdf/MainSensorLabel'
import ActivatedDevice from '../utilities/ActivatedDevice'
import RenamerDeviceRow from '../components/RenamerDeviceRow'

function RenamerView(props) {
  const { particleSettings, activatedDevices } = props

  const [productID, setProductID] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [selectedDevice, setSelectedDevice] = useState(new ActivatedDevice())
  const [locationID, setLocationID] = useState('')

  function changeLocationID(newLocationID) {
    setLocationID(newLocationID)
  }

  function changeSelectedDevice(newDevice) {
    setSelectedDevice(newDevice)
    setProductID(newDevice.productID)
    setSerialNumber(newDevice.serialNumber)
  }

  async function handleSubmit(event) {
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
  }

  return (
    <>
      <h1 style={{ paddingLeft: '20px' }}>Renamer</h1>
      <div style={styles.parent}>
        <div style={styles.column}>
          <h3>Select Device</h3>
          <hr />
          <h4>Search Device</h4>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formProductSelect">
              <Form.Label>Select Device Product Family</Form.Label>
              <Form.Control
                as="select"
                value={productID}
                onChange={x => {
                  setProductID(x.target.value)
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
              <Form.Control placeholder="Serial Number" value={serialNumber} maxLength="15" onChange={x => setSerialNumber(x.target.value)} />
              <Form.Text className="text-muted">This is retrieved by scanning the barcode on the particle device.</Form.Text>
            </Form.Group>

            <Button variant="outline-primary" type="submit">
              Search
            </Button>
          </Form>
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
        </div>
        <div style={styles.expandedColumn}>
          <h3>In Progress</h3>
          <hr />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <CurrentDeviceCard currentDeviceName={selectedDevice.deviceName} />
            {/* eslint-disable-next-line react/jsx-no-constructed-context-values */}
            <IconContext.Provider value={{ color: '#0b6efd', size: '2em' }}>
              <BsFillArrowRightSquareFill />
            </IconContext.Provider>
            <NewNameCard locationID={locationID} changeLocationID={changeLocationID} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
            <DoorSensorLabel locationName="WES" sensorNumber={133} locationNumber={3} />
            <MainSensorLabel locationName="WES" sensorNumber={133} locationNumber={3} />
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

function CurrentDeviceCard(props) {
  const { currentDeviceName } = props

  return (
    <Card style={{ height: '100%' }}>
      <Card.Header>Current Device Name</Card.Header>
      <Card.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>
          <h4 style={{ textAlign: 'center' }}>{currentDeviceName}</h4>
        </div>
      </Card.Body>
    </Card>
  )
}

CurrentDeviceCard.propTypes = {
  currentDeviceName: PropTypes.string,
}

CurrentDeviceCard.defaultProps = {
  currentDeviceName: '',
}

function NewNameCard(props) {
  const { locationID, changeLocationID, handleSubmit } = props

  return (
    <Card>
      <Card.Header>New Device Name</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Text>Location ID</Form.Text>
            <Form.Control value={locationID} onChange={x => changeLocationID(x.target.value)} />
          </Form.Group>
          <div style={{ paddingTop: '10px' }}>
            <Button type="submit">Rename Device</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

NewNameCard.propTypes = {
  locationID: PropTypes.string,
  changeLocationID: PropTypes.func,
  handleSubmit: PropTypes.func,
}

NewNameCard.defaultProps = {
  locationID: '',
  changeLocationID: () => {},
  handleSubmit: () => {},
}

export default RenamerView
