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

function ClientParticleFunctions(props) {
  const { token, changeToken, environment } = props

  const [cookies] = useCookies(['googleIdToken'])
  const [displayName, setDisplayName] = useState('')
  const [functionName, setFunctionName] = useState('')
  const [argument, setArgument] = useState('')

  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [deviceFunctionList, setFunctionList] = useState([])

  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)

  const [allClientDevices, setAllClientDevices] = useState([])
  const [selectedDevices, setSelectedDevices] = useState([])

  useEffect(() => {
    changeToken(getParticleToken())
  }, [changeToken])

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
      const firmwareChecks = await Promise.all(
        selectedDevices
          .map(locationID => {
            const device = allClientDevices.find(dev => dev.locationID === locationID)
            return device ? getFirmwareVersion(device.deviceID, token) : null
          })
          .filter(Boolean),
      )

      console.log(firmwareChecks)

      const firmwareVersions = firmwareChecks.map(check => check.firmwareVersion)

      // create a new set that automatically discards duplicate entries and perform a check
      const uniqueFirmwareVersions = [...new Set(firmwareVersions)]
      if (uniqueFirmwareVersions.length > 1) {
        setErrorMessage(
          'Firmware versions are not consistent across selected devices - cannot process client functions. Please do it manually in Particle console.',
        )
        setShowErrorAlert(true)
        return
      }

      const deviceToUseLocationID = selectedDevices[0]
      const deviceToUse = allClientDevices.find(dev => dev.locationID === deviceToUseLocationID)

      if (deviceToUse) {
        const functionResults = await getFunctionList(deviceToUse.deviceID, token)

        if (functionResults.success) {
          setFunctionList(functionResults.functionList)
          setSuccessMessage(`All devices are on firmware version: ${uniqueFirmwareVersions[0]}. Extracted function list successfully.`)
          setShowSuccessAlert(true)
        } else {
          setErrorMessage('Failed to extract functions from the selected device.')
          setShowErrorAlert(true)
        }
      } else {
        setErrorMessage('Selected device not found in the client devices list.')
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

    try {
      const results = await Promise.all(
        selectedDevices
          .map(locationID => {
            const device = allClientDevices.find(dev => dev.locationID === locationID)
            return device ? callClientParticleFunction(device.displayName, device.locationID, device.deviceID, functionName, argument, token) : null
          })
          .filter(Boolean),
      )

      results.forEach(result => {
        const displayObject = {
          name: result.displayName,
          locationID: result.locationID,
          returnValue: result.returnValue,
        }

        if (result.success) {
          successfulCalls.push(displayObject)
        } else {
          failedCalls.push(displayObject)
        }
      })

      if (successfulCalls.length > 0) {
        const successDetails = successfulCalls
          .map(call => `[name: '${call.name}', locationID: '${call.locationID}', return_value: '${call.returnValue}']`)
          .join('\n')
        setSuccessMessage(`Successfully called particle functions for ${successfulCalls.length} devices:\n${successDetails}`)
        setShowSuccessAlert(true)
      }

      if (failedCalls.length > 0) {
        const errorDetails = failedCalls.map(call => `[name: '${call.name}', locationID: '${call.locationID}']`).join('\n')
        setErrorMessage(
          `Error calling function for ${failedCalls.length} devices. Please check the status of these devices in Particle console:\n${errorDetails}`,
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
