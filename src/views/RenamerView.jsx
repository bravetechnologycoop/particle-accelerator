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
import { modifyClickupTaskCustomFieldValue, modifyClickupTaskName, modifyClickupTaskStatus } from '../utilities/ClickupFunctions'
import { purchaseSensorTwilioNumberByAreaCode } from '../utilities/TwilioFunctions'

import DropdownList from '../components/DropdownList'
import PhoneNumberStatus from '../components/PhoneNumberStatus'
import { getSensorClients, insertSensorLocation } from '../utilities/DatabaseFunctions'
import ClickupStatuses from '../utilities/ClickupStatuses'
import { copyActivatedDevices } from '../utilities/StorageFunctions'

function RenamerView(props) {
  const { particleSettings, activatedDevices, particleToken, clickupToken, clickupListID } = props

  const blankActivatedDevice = ActivatedDevice.BlankDevice()

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
  const [environment, setEnvironment] = useState('dev')

  function changeEnvironment(newEnviroment) {
    setEnvironment(newEnviroment)
  }

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
      const statusChange = await modifyClickupTaskStatus(selectedDevice.clickupTaskID, ClickupStatuses.registeredToClient.name, clickupToken)
      if (rename && statusChange) {
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

      // If statement would go here for environment selection. See ButtonRegistrationView.jsx for example code

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
      height: '90vh',
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
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <h4 style={{ paddingTop: '20px' }}>Select From Activated Devices</h4>
            <div style={{ overflow: 'auto', height: '30ch' }}>
              {activatedDevices.map(device => {
                return (
                  <li key={`${device.timeStamp}${device.dateStamp}`} style={{ listStyle: 'none', paddingTop: '0.3em', paddingBottom: '0.3em' }}>
                    <RenamerDeviceRow device={device} currentDevice={selectedDevice} changeCurrentDevice={changeSelectedDevice} />
                  </li>
                )
              })}
            </div>
          </div>
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
                    disabled={locationID === '' || !twilioCheck}
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
                environment={environment}
                changeEnvironment={changeEnvironment}
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
            <Form.Label style={{ paddingTop: '10px' }}>Phone Number Area Code</Form.Label>
            <Form.Control placeholder="Area Code" value={twilioCityName} onChange={x => changeTwilioCityName(x.target.value)} />
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
    environment,
    changeEnvironment,
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
  environment: PropTypes.string.isRequired,
  changeEnvironment: PropTypes.func.isRequired,
}

export default RenamerView
