import { Form, Alert } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { useCookies } from 'react-cookie'
import PropTypes from 'prop-types'
import { getParticleToken } from '../utilities/StorageFunctions'

const { getClientDevices } = require('../utilities/DatabaseFunctions')
const { callClientParticleFunction, getFirmwareVersion, getFunctionList } = require('../utilities/ParticleFunctions')

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

  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [returnMessage, setReturnMessage] = useState('')

  const [deviceFunctionList_new, setFunctionList] = useState([])

  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [showReturnAlert, setShowReturnAlert] = useState(false)

  const [allClientDevices, setAllClientDevices] = useState([])
  const [selectedDevices, setSelectedDevices] = useState([])

  useEffect(() => {
    changeToken(getParticleToken())
  }, [changeToken])

  // test
  useEffect(() => {
    console.log(deviceFunctionList_new)
  }, [deviceFunctionList_new])

  function toggleDeviceSelection(locationID) {
    setSelectedDevices(prev => (prev.includes(locationID) ? prev.filter(dev => dev !== locationID) : [...prev, locationID]))
  }

  function handleSelectAll(event) {
    if (event.target.checked) {
      setSelectedDevices(allClientDevices.map(device => device.locationID))
    } else {
      setSelectedDevices([])
    }
  }

  async function handleFetchDevices(event) {
    event.preventDefault()
    try {
      const devices = await getClientDevices(displayName, environment, cookies.googleIdToken)
      if (!devices || devices.length === 0) {
        setErrorMessage('No client devices found for this client name.')
        setShowErrorAlert(true)
        setAllClientDevices([])
        setSelectedDevices([])
        return
      }

      console.log(devices)

      setAllClientDevices(devices)
      setSelectedDevices([])
      setErrorMessage('')
      setShowErrorAlert(false)
    } catch (error) {
      setErrorMessage('An error occurred while fetching devices. Please try again.')
      setShowErrorAlert(true)
    }
  }

  async function handleExtractFunctions() {
    if (selectedDevices.length === 0) {
      setErrorMessage('Please select at least one device to verify the firmware.')
      setShowErrorAlert(true)
      return
    }

    try {
      const firmwareChecks = await Promise.all(selectedDevices.map(deviceID => getFirmwareVersion(deviceID, token)))

      console.log(firmwareChecks)

      const firmwareVersions = firmwareChecks.map(check => check.firmwareVersion)
      const uniqueFirmwareVersions = [...new Set(firmwareVersions)]

      if (uniqueFirmwareVersions.length > 1) {
        setErrorMessage('Firmware versions are not consistent across selected devices.')
        setShowErrorAlert(true)
        return
      }

      // if firmware is consistent, extract functions using the first device in the list
      const deviceToUse = selectedDevices[0]
      const functionResults = await getFunctionList(deviceToUse.deviceID, token)

      if (functionResults.success) {
        setFunctionList(functionResults.functionList)
        setSuccessMessage(`All devices are on firmware version: ${uniqueFirmwareVersions[0]}. Extracted function list successfully.`)
        setShowSuccessAlert(true)
      } else {
        setErrorMessage('Failed to extract functions from the selected device.')
        setShowErrorAlert(true)
      }
    } catch (error) {
      setErrorMessage('An error occurred while verifying firmware. Please try again.')
      setShowErrorAlert(true)
    }
  }

  async function handleCallFunction() {
    if (selectedDevices.length === 0) {
      setErrorMessage('Please select at least one device.')
      setShowErrorAlert(true)
      return
    }

    const successfulCalls = []
    const failedCalls = []
    const returnValueCalls = [] // for calls that give a meaningful return value

    try {
      const results = await Promise.all(selectedDevices.map(serialNumber => callClientParticleFunction(serialNumber, functionName, argument, token)))

      results.forEach(result => {
        if (result.success && argument === 'e') {
          successfulCalls.push(result.deviceID)

          // make a return value object for display
          const returnValueObject = {
            deviceID: result.deviceID,
            returnValue: result.returnValue,
          }
          returnValueCalls.push(returnValueObject)
        } else if (result.success) {
          successfulCalls.push(result.deviceID)
        } else {
          failedCalls.push(result.deviceID)
        }
      })

      if (successfulCalls.length > 0) {
        setSuccessMessage(`Successfully called particle functions for ${successfulCalls.length} devices.`)
        setShowSuccessAlert(true)
      }

      if (returnValueCalls.length > 0) {
        const returnMessageFormatted = returnValueCalls.map(call => `Device ID: ${call.deviceID} - Return Value: ${call.returnValue}`).join('\n')
        setReturnMessage(`Here are the return values of the function calls:\n${returnMessageFormatted}`)
        setShowReturnAlert(true)
      }

      if (failedCalls.length > 0) {
        setErrorMessage(
          `Error calling function for ${failedCalls.length} devices: ${failedCalls.join(
            ', ',
          )}. Please check the status of these devices in Particle console.`,
        )
        setShowErrorAlert(true)
      }
    } catch (error) {
      setErrorMessage('An error occurred while calling the particle function. Please try again.')
      setShowErrorAlert(true)
    }
  }

  return (
    <div style={styles.column}>
      <div>
        <h3>Client Particle Functions</h3>
        <hr />
      </div>

      {showSuccessAlert && (
        <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
          {successMessage}
        </Alert>
      )}
      {showReturnAlert && (
        <Alert variant="success" onClose={() => setShowReturnAlert(false)} dismissible>
          {returnMessage}
        </Alert>
      )}
      {showErrorAlert && (
        <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
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
                <li key={device.locationID} style={styles.deviceListItem}>
                  <Form.Check
                    type="checkbox"
                    label={`${device.displayName} (${device.locationID})`}
                    onChange={() => toggleDeviceSelection(device.locationID)}
                    checked={selectedDevices.includes(device.locationID)}
                  />
                </li>
              ))}
            </ul>

            <Button variant="primary" onClick={handleExtractFunctions}>
              Extract Functions
            </Button>
          </div>
        )}

        <hr />

        {allClientDevices.length > 0 && deviceFunctionList.length > 0 && (
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
