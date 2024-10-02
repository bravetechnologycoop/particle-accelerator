import { Form, Alert } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { useCookies } from 'react-cookie'
import PropTypes from 'prop-types'
import { getParticleToken } from '../utilities/StorageFunctions'

const { getClientDevices } = require('../utilities/DatabaseFunctions')
const { callClientParticleFunction } = require('../utilities/ParticleFunctions')

const styles = {
  column: {
    flex: '0 0 35%',
    padding: 20,
    alignItems: 'top',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollView: {
    overflow: 'auto',
    paddingRight: '5px',
    paddingLeft: '5px',
    paddingBottom: '5px',
  },
  deviceList: {
    listStyleType: 'none',
    paddingLeft: 0,
  },
  deviceListItem: {
    padding: '2px 0',
  },
  selectAll: {
    margin: '8px 0px 8px 0px',
  },
}

const deviceFunctionList = [
  'Force_Reset',
  'Turn_Debugging_Publishes_On_Off',
  'Change_Occupant_Detection_Timer',
  'Change_Initial_Timer',
  'Change_Duration_Timer',
  'Change_Stillness_Timer',
  'Change_Long_Stillness_Timer',
  'Change_INS_Threshold',
  'Change_IM21_Door_ID',
  'Reset_Stillness_Timer_For_Alerting_Session',
]

function ClientParticleFunctions(props) {
  const { token, changeToken, environment } = props

  const [cookies] = useCookies(['googleIdToken'])
  const [displayName, setDisplayName] = useState('')
  const [functionName, setFunctionName] = useState('')
  const [argument, setArgument] = useState('')

  const [errorMessage, setErrorMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [alertVariant, setAlertVariant] = useState('danger')

  const [allClientDevices, setAllClientDevices] = useState([])
  const [selectedDevices, setSelectedDevices] = useState([])

  useEffect(() => {
    changeToken(getParticleToken())
  }, [changeToken])

  // Toggle a specific device's selection
  function toggleDeviceSelection(serialNumber) {
    setSelectedDevices(prev => (prev.includes(serialNumber) ? prev.filter(dev => dev !== serialNumber) : [...prev, serialNumber]))
  }

  // Select or deselect all devices
  function handleSelectAll(event) {
    if (event.target.checked) {
      setSelectedDevices(allClientDevices.map(device => device.serial_number))
    } else {
      setSelectedDevices([])
    }
  }

  // Handle fetching devices for the client
  async function handleFetchDevices(event) {
    event.preventDefault()
    try {
      const devices = await getClientDevices(displayName, environment, cookies.googleIdToken)
      if (!devices || devices.length === 0) {
        setErrorMessage('No client devices found for this client name.')
        setAlertVariant('danger')
        setShowAlert(true)
        return
      }

      setAllClientDevices(devices)
      setSelectedDevices([]) // Reset selections
      setErrorMessage('')
      setShowAlert(false)
    } catch (error) {
      setErrorMessage('An error occurred while fetching devices. Please try again.')
      setAlertVariant('danger')
      setShowAlert(true)
    }
  }

  // Handle calling the Particle function for selected devices
  async function handleCallFunction() {
    if (selectedDevices.length === 0) {
      setErrorMessage('Please select at least one device.')
      setAlertVariant('danger')
      setShowAlert(true)
      return
    }

    try {
      await Promise.all(selectedDevices.map(serialNumber => callClientParticleFunction(serialNumber, functionName, argument, token)))

      setErrorMessage('Particle function called successfully for selected devices!')
      setAlertVariant('success')
      setShowAlert(true)
    } catch (error) {
      setErrorMessage('An error occurred while calling the particle function. Please try again.')
      setAlertVariant('danger')
      setShowAlert(true)
    }
  }

  return (
    <div style={styles.column}>
      <div>
        <h3>Client Particle Functions</h3>
        <hr />
      </div>

      {showAlert && (
        <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
          {errorMessage}
        </Alert>
      )}

      <div style={styles.scrollView}>
        <Form onSubmit={handleFetchDevices}>
          <Form.Group className="mb-3" controlId="formDisplayName">
            <Form.Label>Client Name</Form.Label>
            <Form.Control placeholder="Client Name" value={displayName} onChange={x => setDisplayName(x.target.value)} />
            <Form.Text className="text-muted">The display name of the client in the database.</Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit">
            Fetch Devices
          </Button>
        </Form>

        <hr />

        {allClientDevices.length > 0 && (
          <div>
            <h5>Select Devices</h5>
            <Form.Check
              type="checkbox"
              label="Select All Devices"
              onChange={handleSelectAll}
              checked={selectedDevices.length === allClientDevices.length}
              style={styles.selectAll}
            />

            <ul style={styles.deviceList}>
              {allClientDevices.map(device => (
                <li key={device.serial_number} style={styles.deviceListItem}>
                  <Form.Check
                    type="checkbox"
                    label={`${device.name} (${device.serial_number})`}
                    checked={selectedDevices.includes(device.serial_number)}
                    onChange={() => toggleDeviceSelection(device.serial_number)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        <hr />

        {allClientDevices.length > 0 && (
          <Form>
            <Form.Group className="mb-3" controlId="formFunctionSelect">
              <Form.Label>Select Particle Function</Form.Label>
              <Form.Control as="select" value={functionName} onChange={x => setFunctionName(x.target.value)}>
                {deviceFunctionList.map(func => (
                  <option key={func} value={func}>
                    {func}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formArgument">
              <Form.Label>Argument</Form.Label>
              <Form.Control placeholder="Argument" value={argument} maxLength="15" onChange={x => setArgument(x.target.value)} />
              <Form.Text className="text-muted">The argument for the function trying to be called.</Form.Text>
            </Form.Group>

            <Button variant="primary" onClick={handleCallFunction}>
              Call Particle Function
            </Button>
          </Form>
        )}
      </div>
    </div>
  )
}

ClientParticleFunctions.propTypes = {
  token: PropTypes.string.isRequired,
  changeToken: PropTypes.func.isRequired,
  environment: PropTypes.string.isRequired,
}

export default ClientParticleFunctions
