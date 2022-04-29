import React, { useState } from 'react'
import { Badge, Card, Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import DoorSensorLabel from '../pdf/DoorSensorLabel'
import MainSensorLabel from '../pdf/MainSensorLabel'
import ActivatedDevice from '../utilities/ActivatedDevice'
import RenamerDeviceRow from '../components/Renamer/RenamerDeviceRow'
import { changeDeviceName } from '../utilities/ParticleFunctions'
import StatusBadge from '../components/general/StatusBadge'
import { modifyClickupTaskCustomFieldValue, modifyClickupTaskName, modifyClickupTaskStatus } from '../utilities/ClickupFunctions'
import { purchaseSensorTwilioNumberByAreaCode } from '../utilities/TwilioFunctions'

import PhoneNumberStatus from '../components/general/PhoneNumberStatus'
import { insertSensorLocation } from '../utilities/DatabaseFunctions'
import { ClickupStatuses } from '../utilities/Constants'
import DashboardConfiguration from '../components/Renamer/DashboardConfiguration'
import TwilioConfiguration from '../components/Renamer/TwilioConfiguration'

export default function Renamer(props) {
  // eslint-disable-next-line no-unused-vars
  const { activatedDevices, particleToken, clickupToken, clickupListID, environment } = props

  const blankActivatedDevice = ActivatedDevice.BlankDevice()

  const [selectedDevice, setSelectedDevice] = useState(blankActivatedDevice)
  const [locationID, setLocationID] = useState('')
  const [sensorNumber, setSensorNumber] = useState('')
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

  function changeLocationID(newLocationID) {
    setLocationID(newLocationID)
  }

  function changeSelectedDevice(newDevice) {
    setSelectedDevice(newDevice)
    setSensorNumber(newDevice.deviceName.replace(/[^0-9]*/, ''))
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
          process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_ID_TWILIO,
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
        environment,
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
      flex: '1 1',
      display: 'flex',
      flexDirection: 'row',
      height: 'inherit',
      padding: 20,
    },
    column: {
      flex: '1 1',
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingTop: '20px',
    },
    toggleButton: {
      fontSize: 'small',
    },
    scrollableColumn: {
      flex: '1 1',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    },
  }

  return (
    <div style={styles.parent}>
      <div style={styles.column}>
        <h3>Select Device</h3>
        <hr />
        <div style={styles.scrollableColumn}>
          {activatedDevices.map(device => {
            return (
              <li key={`${device.timeStamp}${device.dateStamp}`} style={{ listStyle: 'none', paddingTop: '0.3em', paddingBottom: '0.3em' }}>
                <RenamerDeviceRow device={device} currentDevice={selectedDevice} changeCurrentDevice={changeSelectedDevice} />
              </li>
            )
          })}
        </div>
      </div>
      <div style={styles.column}>
        <h3>In Progress</h3>
        <hr />
        <div style={styles.scrollableColumn}>
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
              <TwilioConfiguration twilioCheck={twilioCheck} twilioAreaCode={twilioAreaCode} changeTwilioAreaCode={changeTwilioAreaCode} />
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
            />
            <Card>
              <Card.Header>Device Rename Status</Card.Header>
              <Card.Body>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                  <div style={{ paddingRight: '10px' }}>Renaming Device on Particle:</div>
                  <StatusBadge status={particleStatus} />{' '}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                  <div style={{ paddingRight: '10px' }}>Renaming Task on ClickUp:</div>
                  <StatusBadge status={clickupStatus} />{' '}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                  <div style={{ paddingRight: '10px' }}>Purchasing Twilio Number:</div>
                  <PhoneNumberStatus status={twilioStatus} />{' '}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                  <div style={{ paddingRight: '10px' }}>Registering to Dashboard:</div>
                  <StatusBadge status={dashboardStatus} />{' '}
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
  )
}

Renamer.propTypes = {
  activatedDevices: PropTypes.arrayOf(PropTypes.instanceOf(ActivatedDevice)).isRequired,
  particleToken: PropTypes.string.isRequired,
  clickupToken: PropTypes.string.isRequired,
  clickupListID: PropTypes.string.isRequired,
  environment: PropTypes.string.isRequired,
}
