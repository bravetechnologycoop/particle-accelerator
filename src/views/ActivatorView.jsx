import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Badge, Card, Dropdown } from 'react-bootstrap'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import ActivationAttempt from '../utilities/ActivationAttempt'
import StatusBadge from '../components/StatusBadge'
import DeviceIDStatus from '../components/DeviceIDStatus'
import ICCIDStatus from '../components/ICCIDStatus'
// import { getActivatedDevices, getActivationHistory } from '../utilities/StorageFunctions'
import ActivatedDevice from '../utilities/ActivatedDevice'
import ParticleSettings from '../utilities/ParticleSettings'
import DropdownList from '../components/DropdownList'
import { getClickupCustomFieldsInList, getClickupStatusesInList } from '../utilities/ClickupFunctions'
import ClickupLogin from './ClickupLogin'

const { getDeviceInfo } = require('../utilities/ParticleFunctions')

// const { getProducts } = require('../utilities/ParticleFunctions')

const { activateDeviceSIM } = require('../utilities/ParticleFunctions')

const { changeDeviceName } = require('../utilities/ParticleFunctions')

const { verifyDeviceRegistration } = require('../utilities/ParticleFunctions')

// const { getParticleToken } = require('../utilities/StorageFunctions')

// CSS Styles
const styles = {
  parent: {
    display: 'flex',
    flexDirection: 'row',
  },
  form: {
    flex: '0 0 33%',
    order: 1,
    padding: 20,
    alignItems: 'top',
    display: 'flex',
    flexDirection: 'column',
  },
  statuses: {
    flex: '0 0 33%',
    order: 2,
    padding: 20,
    alignItems: 'top',
    display: 'flex',
    flexDirection: 'column',
  },
  log: {
    flex: '0 0 33%',
    order: 3,
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
  child: {
    padding: 10,
  },
}

/**
 * ActivatorView: React component that displays:
 *                1. The user input form for device activation
 *                2. Device activation statuses
 *                3. Device activation log.
 */
function ActivatorView(props) {
  // eslint-disable-next-line no-unused-vars
  const {
    token,
    activationHistory,
    changeActivationHistory,
    activatedDevices,
    changeActivatedDevices,
    safeModeState,
    particleSettings,
    clickupToken,
    clickupListID,
  } = props

  const [serialNumber, setSerialNumber] = useState('')
  const [deviceID, setDeviceID] = useState('idle')
  const [iccid, setICCID] = useState('idle')
  const [country, setCountry] = useState('')
  const [productID, setProductID] = useState('')
  const [activationStatus, setActivationStatus] = useState('idle')
  const [newDeviceName, setNewDeviceName] = useState('')
  const [renameStatus, setRenameStatus] = useState('idle')
  const [totalStatus, setTotalStatus] = useState('idle')
  const [statusView, setStatusView] = useState(false)
  const [formLock, setFormLock] = useState(false)

  const [clickupCheck, setClickupCheck] = useState(false)
  const [clickupTaskStatus, setClickupTaskStatus] = useState('')
  const [clickupCustomFieldsConfig, setClickupCustomFieldsConfig] = useState({})

  function changeClickupTaskStatus(newStatus) {
    setClickupTaskStatus(newStatus)
  }

  function modifyClickupCustomFieldsConfig(field, value) {
    const configCopy = JSON.parse(JSON.stringify(clickupCustomFieldsConfig))
    configCopy[field] = value
    setClickupCustomFieldsConfig(configCopy)
  }

  function toggleClickupCheck() {
    if (clickupCheck) {
      setClickupCheck(false)
    } else {
      setClickupCheck(true)
    }
  }

  function pushAttempt(newAttempt) {
    const newAttemptArray = [newAttempt]
    const updatedList = newAttemptArray.concat(activationHistory)
    changeActivationHistory(updatedList)
  }

  function pushDevice(newDevice) {
    const newDeviceArray = [newDevice]
    const updatedList = newDeviceArray.concat(activatedDevices)
    changeActivatedDevices(updatedList)
  }

  async function resetDefaults() {
    setSerialNumber('')
    setDeviceID('idle')
    setICCID('idle')
    setCountry('')
    setProductID('')
    setActivationStatus('idle')
    setNewDeviceName('')
    setRenameStatus('idle')
    setTotalStatus('idle')
    setStatusView(false)
    setFormLock(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setFormLock(true)
    setStatusView(true)

    let deviceMatches = []

    if (safeModeState) {
      deviceMatches = activatedDevices.filter(device => {
        return device.deviceName === newDeviceName
      })
    }

    console.log('devicematches', deviceMatches.length)

    if (!safeModeState || deviceMatches.length === 0) {
      let totalStatusCopy = 'idle'
      let deviceIDCopy = 'idle'
      let iccidCopy = 'idle'
      let activationStatusCopy = 'idle'
      let renameStatusCopy = 'idle'

      setDeviceID('waiting')
      deviceIDCopy = 'waiting'
      setICCID('waiting')
      iccidCopy = 'waiting'
      const deviceInfo = await getDeviceInfo(serialNumber, token)
      setDeviceID(deviceInfo.deviceID)
      deviceIDCopy = deviceInfo.deviceID
      setICCID(deviceInfo.iccid)
      iccidCopy = deviceInfo.iccid

      if (!iccidCopy) {
        iccidCopy = 'error'
      }

      if (!deviceIDCopy) {
        deviceIDCopy = 'error'
      }

      setActivationStatus('waiting')
      activationStatusCopy = 'waiting'
      const SIMStatus = await activateDeviceSIM(deviceInfo.iccid, country, `${productID}`, token)
      if (SIMStatus) {
        setActivationStatus('true')
        activationStatusCopy = 'true'
      } else {
        setActivationStatus('error')
        activationStatusCopy = 'error'
      }

      setRenameStatus('waiting')
      renameStatusCopy = 'waiting'

      setDeviceID(deviceInfo.deviceID)
      const rename = await changeDeviceName(deviceInfo.deviceID, productID, newDeviceName, token)

      if (rename) {
        setRenameStatus('true')
        renameStatusCopy = 'true'
      } else {
        setRenameStatus('error')
        renameStatusCopy = 'error'
      }

      setTotalStatus('waiting')
      totalStatusCopy = 'waiting'

      const finalVerification = await verifyDeviceRegistration(deviceInfo.deviceID, newDeviceName, productID, deviceInfo.iccid, serialNumber, token)

      if (finalVerification) {
        setTotalStatus('true')
        totalStatusCopy = 'true'
      } else {
        setTotalStatus('false')
        totalStatusCopy = 'false'
      }

      pushAttempt(
        new ActivationAttempt(
          serialNumber,
          newDeviceName,
          productID,
          deviceIDCopy,
          iccidCopy,
          country,
          activationStatusCopy,
          renameStatusCopy,
          totalStatusCopy,
          null,
          null,
        ),
      )

      if (totalStatusCopy === 'true') {
        pushDevice(new ActivatedDevice(newDeviceName, serialNumber, productID, deviceIDCopy, iccidCopy, null, null, null, false, null))
      }
    } else {
      setFormLock(false)
      setStatusView(false)
      pushAttempt(
        new ActivationAttempt('null', `${newDeviceName} already registered.`, 'null', 'null', 'null', 'null', 'false', 'false', 'false', null, null),
      )
    }
  }

  // eslint-disable-next-line
  // @ts-ignore
  return (
    <div style={styles.parent}>
      <div style={styles.form}>
        <div>
          <h3>Device Details</h3>
          <hr />
        </div>
        <div style={styles.scrollView}>
          {/* eslint-disable-next-line react/jsx-no-bind */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formNewName">
              <Form.Label>New Device Name</Form.Label>
              <Form.Control disabled={formLock} placeholder="Device Name" value={newDeviceName} onChange={x => setNewDeviceName(x.target.value)} />
              <Form.Text className="text-muted">Enter the name to be displayed on the Particle Console.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formProductSelect">
              <Form.Label>Select Device Product Family</Form.Label>
              <Form.Control
                disabled={formLock}
                as="select"
                value={productID}
                onChange={x => {
                  setProductID(x.target.value)
                }}
              >
                <option id="null" key="null" value="null">
                  No Product Family
                </option>
                {particleSettings.productList.map(product => {
                  return (
                    <option key={`${product.id}`} id={`${product.id}`} value={`${product.id}`}>
                      {`${product.id}`.concat(': ', product.name, ' (', product.deviceType, ')')}
                    </option>
                  )
                })}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCountrySelect">
              <Form.Label>Select Country for SIM Activation</Form.Label>
              <Form.Control
                disabled={formLock}
                as="select"
                value={country}
                onChange={x => {
                  setCountry(x.target.value)
                }}
              >
                <option id="XXX" value="">
                  Select Country
                </option>
                <option id="CAN" value="CAN">
                  Canada
                </option>
                <option id="USA" value="USA">
                  United States
                </option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Check type="checkbox" id="default-checkbox" label="Create Clickup Task" checked={!clickupCheck} onChange={toggleClickupCheck} />
            </Form.Group>

            <ClickupConfiguration
              status={clickupCheck}
              customFieldsConfig={clickupCustomFieldsConfig}
              modifyCustomFieldsConfig={modifyClickupCustomFieldsConfig}
              taskStatus={clickupTaskStatus}
              changeTaskStatus={changeClickupTaskStatus}
              clickupToken={clickupToken}
              clickupListID={clickupListID}
            />

            <Form.Group className="mb-3" controlId="formDeviceID">
              <Form.Label>Device Serial Number</Form.Label>
              <Form.Control
                disabled={formLock || country === '' || productID === 'null' || newDeviceName === ''}
                placeholder="Enter ID"
                value={serialNumber}
                maxLength="15"
                onChange={x => setSerialNumber(x.target.value)}
              />
              <Form.Text className="text-muted">This is retrieved by scanning the barcode on the particle device.</Form.Text>
            </Form.Group>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div>
                <Button variant="primary" type="submit" disabled={formLock}>
                  Submit
                </Button>
              </div>
              <div style={{ paddingLeft: '10px' }}>
                <Button variant="danger" type="button" onClick={resetDefaults}>
                  Clear Form
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>

      <div style={styles.statuses}>
        <div>
          <h3>Current Activation Progress</h3>
          <hr />
        </div>
        <div style={styles.scrollView}>
          <div style={styles.child}>
            <h5>Device Information:</h5>
            Device Serial Number: <Badge bg="primary">{serialNumber}</Badge>
            <br />
            New Device Name: <Badge bg="primary">{newDeviceName}</Badge>
          </div>
          <div style={styles.child}>
            Device ID: <DeviceIDStatus deviceID={deviceID} />
            <br />
            ICCID: <ICCIDStatus iccid={iccid} />
          </div>

          <div style={styles.child}>
            <h5>SIM Activation:</h5>
            Status: <StatusBadge status={activationStatus} />
          </div>

          <div style={styles.child}>
            <h5>Device Naming:</h5>
            Status: <StatusBadge status={renameStatus} />
          </div>

          <div style={styles.child}>
            <h5>Activation Verification:</h5>
            Status: <StatusBadge status={totalStatus} />
          </div>

          <div style={styles.child}>
            {/* eslint-disable-next-line react/jsx-no-bind */}
            <Button
              variant="primary"
              onClick={() => {
                setFormLock(false)
                setStatusView(false)
              }}
              disabled={!statusView}
            >
              Next Device
            </Button>
            {/* eslint-disable-next-line react/jsx-no-bind */}
            <Button variant="warning" onClick={handleSubmit} disabled={!statusView}>
              Try Again
            </Button>
          </div>
        </div>
      </div>

      <div style={styles.log}>
        <div>
          <Link to="/activation-history" style={{ color: 'black', textDecoration: 'none' }}>
            <h3>Activation History</h3>
          </Link>
          <hr />
        </div>
        <div style={styles.scrollView}>
          {activationHistory.map(attempt => {
            return (
              <Card key={`${attempt.timeStamp}${attempt.dateStamp}`}>
                <Card.Body>
                  <Card.Title>{attempt.deviceName}</Card.Title>
                  <Card.Subtitle>{`${attempt.dateStamp} ${attempt.timeStamp}`}</Card.Subtitle>
                  Activation: <StatusBadge status={attempt.totalStatus} />
                  <br />
                  Serial Number: <Badge bg="primary">{attempt.serialNumber}</Badge>
                  <br />
                  Product: <Badge bg="primary">{attempt.productID}</Badge>
                  <br />
                  Country: <Badge bg="primary">{attempt.country}</Badge>
                  <br />
                  Device ID: <DeviceIDStatus deviceID={attempt.deviceID} />
                  <br />
                  ICCID: <ICCIDStatus iccid={attempt.iccid} />
                  <br />
                  SIM Activation Status: <StatusBadge status={attempt.SIMActivationStatus} />
                  <br />
                  Rename Status: <StatusBadge status={attempt.namingStatus} />
                </Card.Body>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

ActivatorView.propTypes = {
  token: PropTypes.string,
  activationHistory: PropTypes.arrayOf(PropTypes.instanceOf(ActivationAttempt)),
  changeActivationHistory: PropTypes.func,
  activatedDevices: PropTypes.arrayOf(PropTypes.instanceOf(ActivatedDevice)),
  changeActivatedDevices: PropTypes.func,
  safeModeState: PropTypes.bool,
  particleSettings: PropTypes.instanceOf(ParticleSettings),
  clickupToken: PropTypes.string,
  clickupListID: PropTypes.string,
}

ActivatorView.defaultProps = {
  token: '',
  activationHistory: [],
  changeActivationHistory: () => {},
  activatedDevices: [new ActivatedDevice()],
  changeActivatedDevices: () => {},
  safeModeState: false,
  particleSettings: new ParticleSettings(),
  clickupToken: '',
  clickupListID: '',
}

function ClickupConfiguration(props) {
  const { status, customFieldsConfig, modifyCustomFieldsConfig, taskStatus, changeTaskStatus, clickupToken, clickupListID } = props

  const [listInit, setListInit] = useState(false)
  const [customFields, setCustomFields] = useState([])
  const [taskStatuses, setTaskStatuses] = useState([])
  const [localListID, setLocalListID] = useState(clickupListID)
  const [loading, setLoading] = useState('idle')

  useEffect(() => {
    async function loadFields(token, listID) {
      console.log('effected')
      setLoading('true')
      const [localCustomFields, localTaskStatuses] = await Promise.all([
        getClickupCustomFieldsInList(token, listID),
        getClickupStatusesInList(token, listID),
      ])
      setCustomFields(localCustomFields)
      setTaskStatuses(localTaskStatuses)
      setLoading('false')
    }
    console.log('listinit', listInit)
    console.log('status', status)
    if (!listInit && status) {
      setLocalListID(clickupListID)
      loadFields(clickupToken, clickupListID)
      setListInit(true)
    }

    if (localListID !== clickupListID && status) {
      setLocalListID(clickupListID)
      loadFields(clickupToken, clickupListID)
    }

    console.log('customfields', customFields)
    console.log('fieldsconfig', customFieldsConfig)
    console.log('statuses', taskStatuses)
  })

  function changeDeviceIDCustomField(newID) {
    modifyCustomFieldsConfig('deviceID', newID)
  }

  function changeSerialNumberCustomField(newID) {
    modifyCustomFieldsConfig('serialNumber', newID)
  }

  function changeFormerSensorNumberCustomField(newID) {
    modifyCustomFieldsConfig('formerSensorNumber', newID)
  }

  if (!status) {
    return (
      <>
        <DropdownList itemList={taskStatuses} loading={loading} title="Task Status" changeItem={changeTaskStatus} item={taskStatus} />
        <DropdownList
          itemList={customFields}
          changeItem={changeDeviceIDCustomField}
          item={customFieldsConfig.deviceID}
          loading={loading}
          title="Device ID Custom Field"
        />
        <DropdownList
          itemList={customFields}
          changeItem={changeSerialNumberCustomField}
          item={customFieldsConfig.serialNumber}
          loading={loading}
          title="Serial Number Custom Field"
        />
        <DropdownList
          itemList={customFields}
          changeItem={changeFormerSensorNumberCustomField}
          item={customFieldsConfig.formerSensorNumber}
          loading={loading}
          title="Former Sensor Number Custom Field"
        />
      </>
    )
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>
}

ClickupConfiguration.propTypes = {
  status: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  customFieldsConfig: PropTypes.object.isRequired,
  modifyCustomFieldsConfig: PropTypes.func.isRequired,
  taskStatus: PropTypes.string.isRequired,
  changeTaskStatus: PropTypes.func.isRequired,
  clickupToken: PropTypes.string.isRequired,
  clickupListID: PropTypes.string.isRequired,
}

export default ActivatorView
