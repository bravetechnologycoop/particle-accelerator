import React, { useEffect, useState } from 'react'
import { Badge, ButtonGroup, Card, Form, ToggleButton } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import PropTypes, { any } from 'prop-types'
import ParticleSettings from '../utilities/ParticleSettings'
import DoorSensorLabel from '../pdf/DoorSensorLabel'
import MainSensorLabel from '../pdf/MainSensorLabel'
import ActivatedDevice from '../utilities/ActivatedDevice'
import RenamerDeviceRow from '../components/RenamerDeviceRow'
import { changeDeviceName, getDeviceDetails } from '../utilities/ParticleFunctions'
import StatusBadge from '../components/StatusBadge'
import { modifyClickupTaskCustomFieldValue, modifyClickupTaskName } from '../utilities/ClickupFunctions'
import { purchaseSensorTwilioNumberByAreaCode } from '../utilities/TwilioFunctions'

import countries from '../utilities/ISO3116Alpha2Codes.json'
import DropdownList from '../components/DropdownList'
import PhoneNumberStatus from '../components/PhoneNumberStatus'
import { getSensorClients, insertSensorLocation } from '../utilities/DatabaseFunctions'

function RenamerView(props) {
  const { particleSettings, activatedDevices, particleToken, clickupToken, clickupListID } = props

  const blankActivatedDevice = new ActivatedDevice('', '', '', '', '', '', '', '', null, null)

  const [productID, setProductID] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [selectedDevice, setSelectedDevice] = useState(blankActivatedDevice)
  const [locationID, setLocationID] = useState('')
  const [selectorState, setSelectorState] = useState('searchSerial')
  const [sensorNumber, setSensorNumber] = useState('')
  const [foundDevice, setFoundDevice] = useState(blankActivatedDevice)
  const [searchState, setSearchState] = useState('waiting')
  const [twilioCountryCode, setTwilioCountryCode] = useState('')
  const [twilioAreaCode, setTwilioAreaCode] = useState('')

  const [particleCheck, setParticleCheck] = useState(false)
  const [clickupCheck, setClickupCheck] = useState(false)
  const [twilioCheck, setTwilioCheck] = useState(false)
  const [dashboardCheck, setDashboardCheck] = useState(false)

  const [particleStatus, setParticleStatus] = useState('idle')
  const [clickupStatus, setClickupStatus] = useState('idle')
  const [twilioStatus, setTwilioStatus] = useState('idle')
  const [dashboardStatus, setDashboardStatus] = useState('idle')

  const [client, setClient] = useState('')
  const [stateMachine, setStateMachine] = useState(true)
  const [displayName, setDisplayName] = useState('')
  const [radarType, setRadarType] = useState('')
  const [password, setPassword] = useState('')

  function changePassword(newPassword) {
    setPassword(newPassword)
  }

  function changeClient(newClient) {
    setClient(newClient)
  }

  function changeStateMachine(newState) {
    setStateMachine(newState)
  }

  function changeDisplayName(newName) {
    setDisplayName(newName)
  }

  function changeRadarType(newRadar) {
    setRadarType(newRadar)
  }

  function changeTwilioCountryCode(code) {
    setTwilioCountryCode(code)
  }

  function changeTwilioAreaCode(city) {
    setTwilioAreaCode(city)
  }

  function toggleParticleCheck() {
    if (particleCheck) {
      setParticleCheck(false)
    } else {
      setParticleCheck(true)
    }
  }

  function toggleClickupCheck() {
    if (clickupCheck) {
      setClickupCheck(false)
    } else {
      setClickupCheck(true)
    }
  }

  function toggleTwilioCheck() {
    if (twilioCheck) {
      setTwilioCheck(false)
    } else {
      setTwilioCheck(true)
    }
  }

  function toggleDashboardCheck() {
    if (dashboardCheck) {
      setDashboardCheck(false)
    } else {
      setDashboardCheck(true)
    }
  }

  function changeSearchState(newState) {
    setSearchState(newState)
  }

  function changeFoundDevice(newDevice) {
    setFoundDevice(newDevice)
  }

  function changeLocationID(newLocationID) {
    setLocationID(newLocationID)
  }

  function changeSelectedDevice(newDevice) {
    setSelectedDevice(newDevice)
    setProductID(newDevice.productID)
    setSerialNumber(newDevice.serialNumber)
    setSensorNumber(newDevice.deviceName.replace(/[^0-9]*/, ''))
  }

  function changeProductID(newProductID) {
    setProductID(newProductID)
  }

  function changeSerialNumber(newSerialNumber) {
    setSerialNumber(newSerialNumber)
  }

  async function handleRenameSubmit(event) {
    event.preventDefault()

    let twilioPhoneNumber

    if (particleCheck) {
      setParticleStatus('waiting')
      const rename = await changeDeviceName(selectedDevice.deviceID, selectedDevice.productID, locationID, particleToken)
      if (rename) {
        setParticleStatus('true')
      } else {
        setParticleStatus('error')
      }
    } else {
      setParticleStatus('notChecked')
    }
    if (clickupCheck) {
      setClickupStatus('waiting')
      const rename = await modifyClickupTaskName(selectedDevice.deviceName, locationID, clickupListID, clickupToken)
      if (rename) {
        setClickupStatus('true')
      } else {
        setClickupStatus('error')
      }
    } else {
      setParticleStatus('notChecked')
    }
    if (twilioCheck) {
      setTwilioStatus('waiting')
      const twilioResponse = await purchaseSensorTwilioNumberByAreaCode(twilioAreaCode, locationID, clickupToken)
      if (twilioResponse !== null) {
        setTwilioStatus(twilioResponse.phoneNumber)
        twilioPhoneNumber = twilioResponse.phoneNumber
        await modifyClickupTaskCustomFieldValue(
          selectedDevice.clickupTaskID,
          process.env.REACT_APP_TWILIO_CUSTOM_FIELD_ID,
          twilioPhoneNumber,
          clickupToken,
        )
      } else {
        setTwilioStatus('error')
      }
    } else {
      setTwilioStatus('notChecked')
    }
    if (dashboardCheck) {
      setDashboardStatus('waiting')
      const databaseInsert = await insertSensorLocation(
        clickupToken,
        password,
        locationID,
        displayName,
        selectedDevice.deviceID,
        twilioPhoneNumber,
        stateMachine,
        client,
        radarType,
      )
      if (databaseInsert) {
        setDashboardStatus('true')
      } else {
        setDashboardStatus('error')
      }
    }
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
    setSensorNumber('')
    setFoundDevice(blankActivatedDevice)
    setSearchState('waiting')
    setLocationID('')
    setParticleCheck(false)
    setClickupCheck(false)
    setTwilioCheck(false)
    setDashboardCheck(false)
    setParticleStatus('idle')
    setClickupStatus('idle')
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
            token={particleToken}
            foundDevice={foundDevice}
            changeFoundDevice={changeFoundDevice}
            searchState={searchState}
            changeSearchState={changeSearchState}
          />
        </div>
        <div style={styles.expandedColumn}>
          <h3>In Progress</h3>
          <hr />
          <div style={{ overflowY: 'auto' }}>
            <Card>
              <Card.Header>Device Rename Configuration</Card.Header>
              <Card.Body>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <h6>Current Device Name: </h6>{' '}
                  <h6 style={{ paddingLeft: '5px' }}>
                    <Badge bg="success">{selectedDevice.deviceName}</Badge>
                  </h6>
                </div>
                <Form onSubmit={handleRenameSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                    <h6 style={{ paddingRight: '5px' }}>New Device Name (Location ID): </h6>
                    <Form.Group>
                      <Form.Control value={locationID} onChange={x => changeLocationID(x.target.value)} disabled={selectedDevice.deviceName === ''} />
                    </Form.Group>
                  </div>
                  <Form.Check
                    type="checkbox"
                    id="default-checkbox"
                    label="Rename on Particle"
                    checked={particleCheck}
                    onChange={toggleParticleCheck}
                    disabled={locationID === '' || particleToken === ''}
                  />
                  <Form.Check
                    type="checkbox"
                    id="default-checkbox"
                    label="Rename on ClickUp"
                    checked={clickupCheck}
                    onChange={toggleClickupCheck}
                    disabled={locationID === '' || clickupToken === ''}
                  />
                  <Form.Check
                    type="checkbox"
                    id="default-checkbox"
                    label="Purchase Twilio Number"
                    checked={twilioCheck}
                    onChange={toggleTwilioCheck}
                    disabled={locationID === ''}
                  />
                  <Form.Check
                    type="checkbox"
                    id="default-checkbox"
                    label="Register to Dashboard"
                    checked={dashboardCheck}
                    onChange={toggleDashboardCheck}
                    disabled={locationID === ''}
                  />
                  <div style={{ paddingTop: '10px' }}>
                    <Button type="submit">Rename Device</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
            <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
              <div style={{ paddingBottom: '10px' }}>
                <TwilioConfiguration
                  twilioCheck={twilioCheck}
                  twilioCityName={twilioAreaCode}
                  changeTwilioCityName={changeTwilioAreaCode}
                  twilioCountryCode={twilioCountryCode}
                  changeTwilioCountryCode={changeTwilioCountryCode}
                />
              </div>
              <DashboardConfiguration
                dashboardCheck={dashboardCheck}
                radarType={radarType}
                changeRadarType={changeRadarType}
                client={client}
                changeClient={changeClient}
                clickupToken={clickupToken}
                stateMachine={stateMachine}
                changeStateMachine={changeStateMachine}
                displayName={displayName}
                changeDisplayName={changeDisplayName}
                password={password}
                changePassword={changePassword}
              />
              <Card>
                <Card.Header>Device Rename Status</Card.Header>
                <Card.Body>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                    <div style={{ paddingRight: '10px' }}>Renaming Device on Particle:</div> <StatusBadge status={particleStatus} />{' '}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                    <div style={{ paddingRight: '10px' }}>Renaming Task on ClickUp:</div> <StatusBadge status={clickupStatus} />{' '}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                    <div style={{ paddingRight: '10px' }}>Purchasing Twilio Number:</div> <PhoneNumberStatus status={twilioStatus} />{' '}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                    <div style={{ paddingRight: '10px' }}>Registering to Dashboard:</div> <StatusBadge status={dashboardStatus} />{' '}
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
        <div style={styles.column}>
          <h3>Completed</h3>
          <hr />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <MainSensorLabel locationID={locationID} sensorNumber={sensorNumber} />
            <DoorSensorLabel locationID={locationID} sensorNumber={sensorNumber} />
          </div>
        </div>
      </div>
    </>
  )
}

RenamerView.propTypes = {
  particleSettings: PropTypes.instanceOf(ParticleSettings).isRequired,
  activatedDevices: PropTypes.arrayOf(PropTypes.instanceOf(ActivatedDevice)).isRequired,
  particleToken: PropTypes.string.isRequired,
  clickupToken: PropTypes.string.isRequired,
  clickupListID: PropTypes.string.isRequired,
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
    token,
    foundDevice,
    changeFoundDevice,
    searchState,
    changeSearchState,
  } = props

  async function handleSearchSerialSubmit(event) {
    event.preventDefault()
    const data = await getDeviceDetails(serialNumber, productID, token)
    if (data !== null) {
      changeFoundDevice(new ActivatedDevice(data.name, data.serial_number, `${data.product_id}`, data.id, data.iccid, null, null, '', null, null, ''))
      changeSearchState('found')
    } else {
      changeFoundDevice(new ActivatedDevice('Device Not Found', '', '', '', '', '', '', '', null, null, ''))
      changeSearchState('error')
    }
  }

  if (selectorState === 'searchSerial') {
    return (
      <>
        <h4>Search Device</h4>
        <Form onSubmit={handleSearchSerialSubmit}>
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
        <div style={{ paddingTop: '20px' }}>
          <SearchResult
            searchResult={foundDevice}
            currentDevice={selectedDevice}
            searchState={searchState}
            changeCurrentDevice={changeSelectedDevice}
          />
        </div>
      </>
    )
  }
  if (selectorState === 'select') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <h4 style={{ paddingTop: '20px' }}>Select From Activated Devices</h4>
        <div style={{ overflow: 'auto', height: '40em' }}>
          {activatedDevices.map(device => {
            return (
              <li key={`${device.timeStamp}${device.dateStamp}`} style={{ listStyle: 'none', paddingTop: '0.3em', paddingBottom: '0.3em' }}>
                <RenamerDeviceRow device={device} currentDevice={selectedDevice} changeCurrentDevice={changeSelectedDevice} />
              </li>
            )
          })}
        </div>
      </div>
    )
  }
  if (selectorState === 'searchSensor') {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>
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
  token: PropTypes.string,
  foundDevice: PropTypes.instanceOf(ActivatedDevice).isRequired,
  changeFoundDevice: PropTypes.func,
  searchState: PropTypes.string,
  changeSearchState: PropTypes.func,
}

DeviceSelector.defaultProps = {
  changeSelectedDevice: () => {},
  changeSerialNumber: () => {},
  changeProductID: () => {},
  token: '',
  changeFoundDevice: () => {},
  searchState: '',
  changeSearchState: () => {},
}

function SearchResult(props) {
  const { searchState, searchResult, currentDevice, changeCurrentDevice } = props

  if (searchState === 'found') {
    return (
      <>
        <h4>Search Result</h4>
        <RenamerDeviceRow device={searchResult} currentDevice={currentDevice} changeCurrentDevice={changeCurrentDevice} />
      </>
    )
  }

  if (searchState === 'error') {
    return (
      <>
        <h4>Search Result</h4>
        <h5>Device not found</h5>
      </>
    )
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>
}

SearchResult.propTypes = {
  searchState: PropTypes.string,
  searchResult: PropTypes.instanceOf(ActivatedDevice).isRequired,
  currentDevice: PropTypes.instanceOf(ActivatedDevice).isRequired,
  changeCurrentDevice: PropTypes.func,
}

SearchResult.defaultProps = {
  searchState: 'waiting',
  changeCurrentDevice: () => {},
}

function TwilioConfiguration(props) {
  const { twilioCheck, twilioCountryCode, changeTwilioCountryCode, twilioCityName, changeTwilioCityName } = props
  if (twilioCheck) {
    return (
      <Card>
        <Card.Header>Twilio Configuration</Card.Header>
        <div style={{ padding: '10px' }}>
          <Form.Group>
            <Form.Label>Phone Number Country</Form.Label>
            <DropdownList itemList={countries} changeItem={changeTwilioCountryCode} item={twilioCountryCode} title="Country" />
            <Form.Label style={{ paddingTop: '10px' }}>Phone Number Area Code</Form.Label>
            <Form.Control placeholder="Area Code" value={twilioCityName} onChange={x => changeTwilioCityName(x.target.value)} />
            <Form.Text className="text-muted">Case Sensitive</Form.Text>
          </Form.Group>
        </div>
      </Card>
    )
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>
}

TwilioConfiguration.propTypes = {
  twilioCheck: PropTypes.bool.isRequired,
  twilioCountryCode: PropTypes.string.isRequired,
  changeTwilioCountryCode: PropTypes.func.isRequired,
  twilioCityName: PropTypes.string.isRequired,
  changeTwilioCityName: PropTypes.func.isRequired,
}

function DashboardConfiguration(props) {
  const {
    dashboardCheck,
    displayName,
    changeDisplayName,
    radarType,
    changeRadarType,
    client,
    changeClient,
    clickupToken,
    stateMachine,
    changeStateMachine,
    password,
    changePassword,
  } = props

  const [clientList, setClientList] = useState([])
  const [clientLoading, setClientLoading] = useState('idle')
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    async function retrieveClients() {
      const clients = await getSensorClients(clickupToken)
      setClientList(clients)
    }

    if (!initialized) {
      setClientLoading('true')
      retrieveClients()
      setClientLoading('')
      setInitialized(true)
    }
  })

  if (dashboardCheck) {
    return (
      <Card>
        <Card.Header>Dashboard Configuration</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group>
              <Form.Label>Display Name</Form.Label>
              <Form.Control value={displayName} onChange={x => changeDisplayName(x.target.value)} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Radar Type</Form.Label>
              <Form.Control value={radarType} onChange={x => changeRadarType(x.target.value)} as="select">
                <option id="Innosent" value="Innosent" key="Innosent">
                  Innosent
                </option>
                <option id="XeThru" value="XeThru" key="XeThru">
                  XeThru
                </option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Select Client</Form.Label>
              <DropdownList itemList={clientList} item={client} changeItem={changeClient} loading={clientLoading} title="Client" />
            </Form.Group>

            <Form.Group>
              <Form.Label>State Machine</Form.Label>
              <Form.Control as="select" value={stateMachine} onChange={x => changeStateMachine(JSON.parse(x.target.value))}>
                <option id="true" key="true" value="true">
                  True
                </option>
                <option id="false" key="false" value="false">
                  False
                </option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control value={password} onChange={x => changePassword(x.target.value)} type="password" placeholder="Password" />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    )
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>
}

DashboardConfiguration.propTypes = {
  dashboardCheck: PropTypes.bool.isRequired,
  radarType: PropTypes.string.isRequired,
  changeRadarType: PropTypes.func.isRequired,
  client: PropTypes.string.isRequired,
  changeClient: PropTypes.func.isRequired,
  clickupToken: PropTypes.string.isRequired,
  stateMachine: PropTypes.bool.isRequired,
  changeStateMachine: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired,
  changeDisplayName: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  changePassword: PropTypes.func.isRequired,
}

export default RenamerView
