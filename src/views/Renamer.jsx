import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import { Badge, Card, Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import SensorLabel from '../pdf/SensorLabel'
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
  const { activatedDevices, particleToken, clickupToken, clickupListID, environment, modifyActivatedDevice } = props

  const [cookies] = useCookies(['googleIDToken'])

  const blankActivatedDevice = ActivatedDevice.BlankDevice()

  // the selectedDevice is the device currently selected to be renamed/modified.
  const [selectedDevice, setSelectedDevice] = useState(blankActivatedDevice)
  // essentially the new name of the device to rename to. Used as friendly_name in Twilio, new ClickUp task name, Particle device name, and dashboard locationID.
  const [locationID, setLocationID] = useState('')
  // the sensor number to be placed on the labels.
  const [sensorNumber, setSensorNumber] = useState('')
  const [twilioAreaCode, setTwilioAreaCode] = useState('')

  // State hooks for all of the config options in the renamer.
  const [particleCheck, setParticleCheck] = useState(false)
  const [clickupCheck, setClickupCheck] = useState(false)
  const [twilioCheck, setTwilioCheck] = useState(false)
  const [dashboardCheck, setDashboardCheck] = useState(false)

  // State hooks for all of the statuses of the operations available in the renamer.
  const [particleStatus, setParticleStatus] = useState('notSelected')
  const [clickupStatus, setClickupStatus] = useState('notSelected')
  const [twilioStatus, setTwilioStatus] = useState('notSelected')
  const [dashboardStatus, setDashboardStatus] = useState('notSelected')
  const [twilioErrorMessage, setTwilioErrorMessage] = useState('')

  // config options for the dashboard
  const [client, setClient] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [twilioPhoneNumber, setTwilioPhoneNumber] = useState('')

  // modifier functions for passing hooks.
  function changePassword(newPassword) {
    setPassword(newPassword)
  }

  function changeClient(newClient) {
    setClient(newClient)
  }

  function changeDisplayName(newName) {
    setDisplayName(newName)
  }

  function changeTwilioAreaCode(areaCode) {
    setTwilioAreaCode(areaCode)
  }

  function changeTwilioPhoneNumber(phoneNumber) {
    setTwilioPhoneNumber(phoneNumber)
  }

  function toggleParticleCheck() {
    if (particleCheck) {
      setParticleCheck(false)
      setParticleStatus('notSelected')
    } else {
      setParticleCheck(true)
      setParticleStatus('idle')
    }
  }

  function toggleClickupCheck() {
    if (clickupCheck) {
      setClickupCheck(false)
      setClickupStatus('notSelected')
    } else {
      setClickupCheck(true)
      setClickupStatus('idle')
    }
  }

  function toggleTwilioCheck() {
    if (twilioCheck) {
      setTwilioCheck(false)
      setTwilioStatus('notSelected')
    } else {
      setTwilioCheck(true)
      setTwilioStatus('idle')
    }
  }

  function toggleDashboardCheck() {
    if (dashboardCheck) {
      setDashboardCheck(false)
      setDashboardStatus('notSelected')
    } else {
      setDashboardCheck(true)
      setDashboardStatus('idle')
    }
  }

  function changeLocationID(newLocationID) {
    setLocationID(newLocationID)
  }

  function changeSelectedDevice(newDevice) {
    setSelectedDevice(newDevice)
    // extracts the number out of the former sensor number
    setSensorNumber(newDevice.formerSensorNumber.replace(/[^0-9]*/, ''))

    // clears status
    setParticleStatus(particleCheck ? 'idle' : 'notSelected')
    setClickupStatus(clickupCheck ? 'idle' : 'notSelected')
    setTwilioStatus(twilioCheck ? 'idle' : 'notSelected')
    setDashboardStatus(dashboardCheck ? 'idle' : 'notSelected')
    setTwilioErrorMessage('')
  }

  async function handleRenameSubmit(event) {
    event.preventDefault()

    let newTwilioPhoneNumber = ''
    const modifyDeviceValues = {}

    if (particleCheck) {
      setParticleStatus('waiting')
      // change device name on particle console
      const particleRename = await changeDeviceName(selectedDevice.deviceID, selectedDevice.productID, locationID, particleToken)

      if (particleRename) {
        setParticleStatus('true')
      } else {
        setParticleStatus('error')
      }
    } else {
      setParticleStatus('notSelected')
    }
    if (clickupCheck) {
      setClickupStatus('waiting')
      // rename clickup task on clickup and change status
      const clickupRename = await modifyClickupTaskName(selectedDevice.clickupTaskID, locationID, clickupListID, clickupToken)
      const clickupStatusChange = await modifyClickupTaskStatus(selectedDevice.clickupTaskID, ClickupStatuses.registeredToClient.name, clickupToken)
      if (clickupRename && clickupStatusChange) {
        setClickupStatus('true')
      } else {
        setClickupStatus('error')
      }

      if (clickupStatusChange) {
        modifyDeviceValues.clickupStatus = ClickupStatuses.registeredToClient.name
        modifyDeviceValues.clickupStatusColour = ClickupStatuses.registeredToClient.colour
      }
      if (clickupRename) {
        modifyDeviceValues.deviceName = locationID
      }
    } else {
      setClickupStatus('notSelected')
    }
    if (twilioCheck) {
      setTwilioStatus('waiting')
      // purchase twilio number
      const twilioResponse = await purchaseSensorTwilioNumberByAreaCode(twilioAreaCode, locationID, environment, cookies.googleIDToken)
      if (twilioResponse.message === 'success') {
        setTwilioStatus(twilioResponse.phoneNumber)
        newTwilioPhoneNumber = twilioResponse.phoneNumber
        // modify clickup custom field value
        const twilioFieldChange = await modifyClickupTaskCustomFieldValue(
          selectedDevice.clickupTaskID,
          process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_ID_TWILIO,
          newTwilioPhoneNumber,
          clickupToken,
        )
        if (twilioFieldChange) {
          modifyDeviceValues.twilioNumber = newTwilioPhoneNumber
        }
      } else {
        setTwilioStatus('error')
        setTwilioErrorMessage(twilioResponse)
      }
    } else {
      setTwilioStatus('notSelected')
    }
    if (dashboardCheck) {
      setDashboardStatus('waiting')

      newTwilioPhoneNumber = twilioCheck ? newTwilioPhoneNumber : twilioPhoneNumber
      const databaseInsert = await insertSensorLocation(
        cookies.googleIDToken,
        password,
        locationID,
        displayName,
        selectedDevice.deviceID,
        newTwilioPhoneNumber,
        client,
        environment,
      )
      // modify clickup custom field value
      const twilioFieldChange = await modifyClickupTaskCustomFieldValue(
        selectedDevice.clickupTaskID,
        process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_ID_TWILIO,
        newTwilioPhoneNumber,
        clickupToken,
      )
      if (twilioFieldChange) {
        modifyDeviceValues.twilioNumber = newTwilioPhoneNumber
      }
      const clickupStatusChange = await modifyClickupTaskStatus(selectedDevice.clickupTaskID, ClickupStatuses.addedToDatabase.name, clickupToken)
      if (databaseInsert && clickupStatusChange) {
        setDashboardStatus('true')
        modifyDeviceValues.clickupStatus = ClickupStatuses.addedToDatabase.name
        modifyDeviceValues.clickupStatusColour = ClickupStatuses.addedToDatabase.colour
      } else {
        setDashboardStatus('error')
      }
    }
    modifyActivatedDevice(selectedDevice.clickupTaskID, modifyDeviceValues)
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
              <TwilioConfiguration twilioCheck={twilioCheck} twilioAreaCode={twilioAreaCode} changeTwilioAreaCode={changeTwilioAreaCode} />
            </div>
            <DashboardConfiguration
              dashboardCheck={dashboardCheck}
              client={client}
              changeClient={changeClient}
              idToken={cookies.googleIDToken}
              displayName={displayName}
              changeDisplayName={changeDisplayName}
              password={password}
              changePassword={changePassword}
              environment={environment}
              twilioPhoneNumber={twilioPhoneNumber}
              changeTwilioPhoneNumber={changeTwilioPhoneNumber}
              displayTwilioPhoneNumber={!twilioCheck}
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
                {twilioStatus === 'error' && (
                  <div>
                    <p style={{ color: 'red' }}>{twilioErrorMessage}</p>
                  </div>
                )}
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
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'baseline' }}>
          <SensorLabel locationID={locationID} sensorNumber={sensorNumber} />
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
  modifyActivatedDevice: PropTypes.func.isRequired,
}
