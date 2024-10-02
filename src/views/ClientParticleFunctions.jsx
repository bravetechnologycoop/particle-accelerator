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

  const [allClientDevices, setAllClientDevices] = useState([])
  const [selectedDevices, setSelectedDevices] = useState([])
  const [results, setResults] = useState({})

  useEffect(() => {
    changeToken(getParticleToken())
  }, [changeToken])

  function toggleDeviceSelection(serialNumber) {
    setSelectedDevices(prev => (prev.includes(serialNumber) ? prev.filter(dev => dev !== serialNumber) : [...prev, serialNumber]))
  }

  async function handleFetchDevices(event) {
    event.preventDefault()
    try {
      const devices = await getClientDevices(displayName, environment, cookies.googleIdToken)
      if (!devices || devices.length === 0) {
        console.error('No client devices found.')
        setErrorMessage('No client devices found for this client name.')
        setShowAlert(true)
        return
      }

      setAllClientDevices(devices)
      setErrorMessage('')
      setShowAlert(false)
      console.log('Devices fetched:', devices)
    } catch (error) {
      console.error('Error fetching devices:', error)
      setErrorMessage('An error occurred while fetching devices. Please try again.')
      setShowAlert(true)
    }
  }

  async function handleCallFunction() {
    if (selectedDevices.length === 0) {
      console.error('No devices selected for function call.')
      setErrorMessage('Please select at least one device.')
      setShowAlert(true)
      return
    }

    try {
      const callResults = await Promise.all(
        selectedDevices.map(serialNumber => callClientParticleFunction(serialNumber, functionName, argument, token)),
      )

      const newResults = {}
      selectedDevices.forEach((serialNumber, index) => {
        newResults[serialNumber] = callResults[index]
      })

      setResults(newResults)
      setErrorMessage('Particle function called successfully!')
      setShowAlert(true)

      console.log('Function call results:', newResults)
    } catch (error) {
      console.error('Error calling particle function:', error)
      setErrorMessage('An error occurred while calling the particle function. Please try again.')
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
        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
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

        {allClientDevices.length > 0 && (
          <div>
            <h5>Select Devices</h5>
            {allClientDevices.map(device => (
              <Form.Check
                key={device.serial_number}
                type="checkbox"
                label={`${device.name} (${device.serial_number})`}
                checked={selectedDevices.includes(device.serial_number)}
                onChange={() => toggleDeviceSelection(device.serial_number)}
              />
            ))}
          </div>
        )}

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

        {Object.keys(results).length > 0 && (
          <div>
            <h5>Function Call Results</h5>
            <ul>
              {allClientDevices.map(device => (
                <li key={device.serial_number}>
                  {device.name} ({device.serial_number}) - {results[device.serial_number] ? 'Success [✓]' : 'Failed [x]'}
                </li>
              ))}
            </ul>
          </div>
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
