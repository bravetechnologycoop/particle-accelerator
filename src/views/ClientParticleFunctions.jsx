import { Form, Alert, Spinner } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { useCookies } from 'react-cookie'
import PropTypes from 'prop-types'
import { getParticleToken } from '../utilities/StorageFunctions'

const { getClientDevices, getSensorClients } = require('../utilities/DatabaseFunctions')
const { callClientParticleFunction, getFirmwareVersion, getFunctionList } = require('../utilities/ParticleFunctions')

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflowY: 'auto',
    padding: '20px',
  },
  contentContainer: {
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
    margin: '8px 0',
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownMenu: {
    position: 'absolute',
    width: '100%',
    zIndex: 1000,
  },
}

function ClientParticleFunctions(props) {
  const { token, changeToken, environment } = props
  const [cookies] = useCookies(['googleIdToken'])

  const [loadingClients, setLoadingClients] = useState(false)
  const [loadingDevices, setloadingDevices] = useState(false)
  const [loadingFunctions, setLoadingFunctions] = useState(false)
  const [loadingCallFunction, setLoadingCallFunction] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const [displayName, setDisplayName] = useState('')
  const [clientData, setClientData] = useState({ functionName: '', argument: '' })

  const [alerts, setAlerts] = useState([])
  const [devices, setDevices] = useState({ all: [], selected: [] })
  const [clientList, setClientList] = useState([])
  const [functionList, setFunctionList] = useState([])

  function toggleDeviceSelection(locationID) {
    setDevices(prevDevices => ({
      ...prevDevices,
      selected: prevDevices.selected.includes(locationID)
        ? prevDevices.selected.filter(dev => dev !== locationID)
        : [...prevDevices.selected, locationID],
    }))
  }

  function handleSelectAll(event) {
    setDevices(prevDevices => ({
      ...prevDevices,
      selected: event.target.checked ? prevDevices.all.map(device => device.locationID) : [],
    }))
  }

  function addAlert(message, type, callsArray = null) {
    setAlerts(prevAlerts => [...prevAlerts, { id: Date.now(), message, type, callsArray }])
  }

  function removeAlert(id) {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id))
  }

  function handleInputChange(e) {
    setClientData({ ...clientData, [e.target.name]: e.target.value })
  }

  async function retrieveClients() {
    setLoadingClients(true)
    try {
      const clients = await getSensorClients(environment, cookies.googleIdToken)
      setClientList(clients)
    } catch (error) {
      addAlert('An error occurred while fetching clients. Please try again.', 'danger')
    } finally {
      setLoadingClients(false)
    }
  }

  async function handleFetchDevices(event) {
    event.preventDefault()

    setloadingDevices(true)
    setDevices({ all: [], selected: [] })
    setClientData({ functionName: '', argument: '' })
    setFunctionList([])
    setAlerts([])

    try {
      const fetchedDevices = await getClientDevices(displayName, environment, cookies.googleIdToken)
      if (!fetchedDevices || fetchedDevices.length === 0) {
        addAlert('No client devices found for this client name.', 'danger')
      } else {
        setDevices({ all: fetchedDevices, selected: [] })
        addAlert(`Successfully fetched ${fetchedDevices.length} devices.`, 'success')
      }
    } catch (error) {
      addAlert('An error occurred while fetching devices. Please try again.', 'danger')
    } finally {
      setloadingDevices(false)
    }
  }

  async function handleGetFunctions() {
    if (devices.selected.length === 0) {
      addAlert('Please select at least one device.', 'danger')
      return
    }

    setLoadingFunctions(true)
    setClientData({ functionName: '', argument: '' })
    setFunctionList([])
    setAlerts([])

    try {
      const firmwareChecks = await Promise.all(
        devices.selected
          .map(locationID => {
            const device = devices.all.find(dev => dev.locationID === locationID)
            return device ? getFirmwareVersion(device.deviceID, token) : null
          })
          .filter(Boolean),
      )

      // perform firmware check
      const firmwareVersions = firmwareChecks.map(check => check.firmwareVersion)
      const uniqueFirmwareVersions = [...new Set(firmwareVersions)]
      if (uniqueFirmwareVersions.length > 1) {
        addAlert('Firmware versions are not consistent across selected devices. Please handle manually in the Particle console.', 'danger')
        return
      }

      // use the first device to get the function list
      const deviceToUseLocationID = devices.selected[0]
      const deviceToUse = devices.all.find(dev => dev.locationID === deviceToUseLocationID)
      if (deviceToUse) {
        const functionResults = await getFunctionList(deviceToUse.deviceID, token)

        if (functionResults.success) {
          setFunctionList(functionResults.functions)
          addAlert(`All devices are on firmware version: ${uniqueFirmwareVersions[0]}. Function list extracted successfully.`, 'success')
        } else {
          addAlert('Failed to extract functions from the selected device.', 'danger')
        }
      } else {
        addAlert('Selected device not found in the client devices list.', 'danger')
      }
    } catch (error) {
      addAlert('An error occurred while verifying firmware. Please try again.', 'danger')
    } finally {
      setLoadingFunctions(false)
    }
  }

  async function handleCallFunction() {
    if (devices.selected.length === 0) {
      addAlert('Please select at least one device.', 'danger')
      return
    }

    setLoadingCallFunction(true)
    setAlerts([])

    try {
      const results = await Promise.all(
        devices.selected
          .map(locationID => {
            const device = devices.all.find(dev => dev.locationID === locationID)
            return device
              ? callClientParticleFunction(
                  device.displayName,
                  device.locationID,
                  device.deviceID,
                  clientData.functionName,
                  clientData.argument,
                  token,
                )
              : null
          })
          .filter(Boolean),
      )

      const successCallResults = []
      const failCallResults = []

      // depending upon call success, store the call results
      results.forEach(result => {
        const resultDetails = {
          name: result.displayName,
          locationID: result.locationID,
          returnValue: result.returnValue,
        }

        if (result.success && result.returnValue !== -1) {
          successCallResults.push(resultDetails)
        } else {
          failCallResults.push(resultDetails)
        }
      })

      // render call results as alert messages
      if (successCallResults.length > 0) {
        addAlert(`Successfully called functions for ${successCallResults.length} devices.`, 'success', successCallResults)
      }
      if (failCallResults.length > 0) {
        addAlert(`Failed to call functions for ${failCallResults.length} devices.`, 'danger', failCallResults)
      }
    } catch (error) {
      addAlert('An error occurred while calling the function. Please try again.', 'danger')
    } finally {
      setLoadingCallFunction(false)
    }
  }

  useEffect(() => {
    changeToken(getParticleToken())
  }, [changeToken])

  useEffect(() => {
    retrieveClients()
  }, [environment, cookies.googleIdToken])

  const filteredClients = clientList.filter(client => client.name && client.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div style={styles.pageContainer}>
      <div>
        <h3>Client Particle Functions</h3>
        <hr />
      </div>

      {/* render alerts and optionally callsArray in alerts */}
      {alerts.map(alert => (
        <Alert key={alert.id} variant={alert.type} onClose={() => removeAlert(alert.id)} dismissible>
          <p>{alert.message}</p>
          {alert.callsArray && (
            <div>
              {alert.callsArray.map(call => (
                <div key={`${call.name}-${call.locationID}`}>
                  <strong>{call.name}</strong> (Location ID: {call.locationID}) - Return Value: {call.returnValue}
                </div>
              ))}
            </div>
          )}
        </Alert>
      ))}

      <div style={styles.contentContainer}>
        {/* fetch devices from database */}
        <Form onSubmit={handleFetchDevices}>
          <Form.Group className="mb-3" controlId="formDisplayName" style={styles.dropdownContainer}>
            <Form.Label>Client Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search Client"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value)
                setShowDropdown(true)
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              disabled={loadingClients}
            />
            {showDropdown && (
              <div className="dropdown-menu show" style={styles.dropdownMenu}>
                {filteredClients.length > 0 ? (
                  filteredClients.map(client => (
                    <button
                      key={client.id}
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setDisplayName(client.name)
                        setSearchTerm(client.name)
                        setShowDropdown(false)
                      }}
                    >
                      {client.name}
                    </button>
                  ))
                ) : (
                  <div className="dropdown-item">No results found</div>
                )}
              </div>
            )}
            <Form.Text className="text-muted">The display name of the client in the database.</Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit" disabled={loadingDevices}>
            {loadingDevices ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Fetch Devices'}
          </Button>
        </Form>

        <hr />

        {/* given all devices are fetched correctly */}
        {devices && devices.all.length > 0 && (
          <div>
            {/* device selection */}
            <h5>Select Devices</h5>
            <Form.Check
              type="checkbox"
              label="Select All Devices"
              onChange={handleSelectAll}
              checked={devices.selected.length === devices.all.length}
              style={styles.selectAll}
            />
            <ul style={styles.deviceList}>
              {/* map each device from all devices to a list item */}
              {devices.all.map(device => (
                <li key={device.locationID} style={styles.deviceListItem}>
                  <Form.Check
                    type="checkbox"
                    label={`${device.displayName} (${device.locationID})`}
                    onChange={() => toggleDeviceSelection(device.locationID)}
                    checked={devices.selected.includes(device.locationID)}
                  />
                </li>
              ))}
            </ul>

            {/* get function list */}
            <Button variant="primary" onClick={handleGetFunctions} disabled={loadingFunctions}>
              {loadingFunctions ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Get Functions'}
            </Button>
          </div>
        )}

        <hr />

        {/* given selected devices and functionList */}
        {devices.selected.length > 0 && functionList && functionList.length > 0 && (
          <Form>
            {/* set client data */}
            <Form.Group className="mb-3" controlId="formFunctionSelect">
              <Form.Label>Select Particle Function</Form.Label>
              <Form.Control as="select" name="functionName" value={clientData.functionName} onChange={handleInputChange}>
                <option value="">-- Select Function --</option>
                {functionList.map(func => (
                  <option key={func} value={func}>
                    {func}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formArgument">
              <Form.Label>Argument</Form.Label>
              <Form.Control name="argument" placeholder="Argument" value={clientData.argument} maxLength="15" onChange={handleInputChange} />
              <Form.Text className="text-muted">The argument for the function being called.</Form.Text>
            </Form.Group>

            {/* call particle functions */}
            <Button variant="primary" onClick={handleCallFunction} disabled={loadingCallFunction}>
              {loadingCallFunction ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Call Particle Function'}
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
