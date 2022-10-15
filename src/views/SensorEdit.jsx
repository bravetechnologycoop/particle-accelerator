// Third-party dependencies
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Alert, Badge, Button, Form } from 'react-bootstrap'

// In-house dependences
import SpinnerWithTimeEstimate from '../components/general/SpinnerWithTimeEstimate'
import ParticleValueFormInput from '../components/SensorEdit/ParticleValueFormInput'
import TestModeAlert from '../components/SensorEdit/TestModeAlert'
import { Environments } from '../utilities/Constants'

const { endTestMode, getSensor, startTestMode, updateSensor } = require('../utilities/DatabaseFunctions')

const styles = {
  scrollView: {
    overflow: 'auto',
    paddingRight: '10px',
    paddingLeft: '10px',
    paddingBottom: '10px',
  },
}

export default function SensorEdit(props) {
  // eslint-disable-next-line no-unused-vars
  const { clickupToken, environment } = props

  const { sensorId } = useParams()

  const [loadStatus, setLoadStatus] = useState('idle') // Controls loading spinner and error display
  const [initialized, setInitialized] = useState(false) // Ensures data is only loaded once
  const [sensor, setSensor] = useState({})
  const [errorMessages, setErrorMessages] = useState([])
  const [formLock, setFormLock] = useState(false)

  let particleSensorProductId = ''
  if (environment === Environments.dev.name) {
    particleSensorProductId = process.env.REACT_APP_PARTICLE_SENSOR_PRODUCT_ID_DEV
  } else if (environment === Environments.prod.name) {
    particleSensorProductId = process.env.REACT_APP_PARTICLE_SENSOR_PRODUCT_ID_PROD
  } else if (environment === Environments.staging.name) {
    particleSensorProductId = process.env.REACT_APP_PARTICLE_SENSOR_PRODUCT_ID_STAGING
  }

  // Load the initial values from backend
  useEffect(() => {
    // no top-level await workaround
    async function load() {
      setLoadStatus('waiting')

      const initialSensorData = await getSensor(sensorId, environment, clickupToken)
      initialSensorData.isActive = initialSensorData.isActive.toString()
      initialSensorData.clientId = initialSensorData.client.id
      initialSensorData.isInDebugMode = initialSensorData.isInDebugMode.toString()

      if (initialSensorData === null) {
        setLoadStatus('error')
      } else if (initialSensorData.length !== 0) {
        setLoadStatus('success')
        setSensor(initialSensorData)
      } else {
        setLoadStatus('empty')
      }
    }

    if (!initialized) {
      load()

      // only load once
      setInitialized(true)
    }
  })

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessages([])
    setFormLock(true)

    const errors = []

    try {
      // Update DB
      const response = await updateSensor(
        sensor.locationid,
        sensor.displayName,
        sensor.movementThreshold,
        sensor.durationTimer,
        sensor.stillnessTimer,
        sensor.radarCoreId,
        sensor.phoneNumber,
        sensor.initialTimer,
        sensor.isActive === 'true',
        sensor.doorId,
        sensor.isInDebugMode === 'true',
        sensor.clientId,
        environment,
        clickupToken,
      )

      if (response.status === 'error') {
        errors.push(response.body)
      } else if (response.status === 'success') {
        response.body.isActive = response.body.isActive.toString()
        response.body.clientId = response.body.client.id
        setSensor(response.body)
      }
    } catch (e) {
      errors.push('Error communicating with the server')
    }

    if (errors.length > 0) {
      setErrorMessages(errors)
    }

    setFormLock(false)
  }

  async function handleStartTestMode(event) {
    event.preventDefault()
    setErrorMessages([])
    setFormLock(true)

    const errors = []

    try {
      const response = await startTestMode(sensorId, environment, clickupToken)
      if (response.status === 'error') {
        errors.push(response.body)
      } else if (response.status === 'success') {
        response.body.isActive = response.body.isActive.toString()
        response.body.clientId = response.body.client.id
        setSensor(response.body)
      }
    } catch (e) {
      errors.push('Error communicating with the server')
    }

    if (errors.length > 0) {
      setErrorMessages(errors)
    }

    setFormLock(false)
  }

  async function handleEndTestMode(event) {
    event.preventDefault()
    setErrorMessages([])
    setFormLock(true)

    const errors = []

    try {
      const response = await endTestMode(sensorId, environment, clickupToken)
      if (response.status === 'error') {
        errors.push(response.body)
      } else if (response.status === 'success') {
        response.body.isActive = response.body.isActive.toString()
        response.body.clientId = response.body.client.id
        setSensor(response.body)
      }
    } catch (e) {
      errors.push('Error communicating with the server')
    }

    if (errors.length > 0) {
      setErrorMessages(errors)
    }

    setFormLock(false)
  }

  return (
    <div style={styles.scrollView}>
      <h1 className="mt-10">
        {sensorId}{' '}
        <a href={`https://console.particle.io/${particleSensorProductId}/devices/${sensor.radarCoreId}`} target="_blank" rel="noreferrer">
          {loadStatus === 'success' && (
            <>
              {sensor.isOnline && <Badge bg="info">Online</Badge>}
              {!sensor.isOnline && <Badge bg="warning">Offline</Badge>}
              {sensor === {} && <Badge bg="danger">Not Found</Badge>}
            </>
          )}
        </a>
      </h1>

      {(loadStatus === 'waiting' || loadStatus === 'idle') && <SpinnerWithTimeEstimate timeEstimate={15} timeEstimateUnits="seconds" />}

      {loadStatus === 'error' && <p>Error retrieving Sensor data</p>}

      {loadStatus === 'success' && (
        <>
          {sensor.isInTestMode && <TestModeAlert disabled={formLock} onEndTestMode={handleEndTestMode} />}

          {sensor.isOnline && !sensor.isInTestMode && sensor.actualIsInDebugMode && (
            <Alert variant="danger">
              Sensor is in <b>DEBUG MODE</b>!!! <br /> This means that it is publishing frequent debug messages. You probably want to turn this off
              before leaving this screen.
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>locationid</Form.Label>
              <Form.Control placeholder={sensor.locationid} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Is this Sensor active?</Form.Label>
              <Form.Select
                aria-label="Is this Sensor active?"
                onChange={x => setSensor({ ...sensor, isActive: x.target.value })}
                value={sensor.isActive}
                disabled={formLock}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Display Name</Form.Label>
              <Form.Control
                type="text"
                value={sensor.displayName}
                onChange={x => setSensor({ ...sensor, displayName: x.target.value })}
                disabled={formLock}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Client</Form.Label>
              <Form.Select
                aria-label="Client"
                onChange={x => setSensor({ ...sensor, clientId: x.target.value })}
                value={sensor.clientId}
                disabled={formLock}
              >
                {sensor.clients &&
                  sensor.clients.map(client => {
                    return (
                      <option value={client.id} key={client.id}>
                        {client.displayName}
                      </option>
                    )
                  })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Radar Particle Core ID</Form.Label>
              <Form.Control
                type="text"
                value={sensor.radarCoreId}
                onChange={x => setSensor({ ...sensor, radarCoreId: x.target.value })}
                disabled={formLock}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={sensor.phoneNumber}
                onChange={x => setSensor({ ...sensor, phoneNumber: x.target.value })}
                disabled={formLock}
              />
            </Form.Group>

            <ParticleValueFormInput
              label="Door ID"
              type="text"
              keyName="doorId"
              actualKeyName="actualDoorId"
              sensor={sensor}
              setSensor={setSensor}
              radix={16}
              disabled={formLock}
            />

            <ParticleValueFormInput
              label="Movement Threshold"
              type="text"
              keyName="movementThreshold"
              actualKeyName="actualMovementThreshold"
              sensor={sensor}
              setSensor={setSensor}
              disabled={formLock}
            />

            <ParticleValueFormInput
              label="Initial Timer (seconds)"
              type="text"
              keyName="initialTimer"
              actualKeyName="actualInitialTimer"
              sensor={sensor}
              setSensor={setSensor}
              disabled={formLock}
            />

            <ParticleValueFormInput
              label="Duration Timer (seconds)"
              type="text"
              keyName="durationTimer"
              actualKeyName="actualDurationTimer"
              sensor={sensor}
              setSensor={setSensor}
              disabled={formLock}
            />

            <ParticleValueFormInput
              label="Stillness Timer (seconds)"
              type="text"
              keyName="stillnessTimer"
              actualKeyName="actualStillnessTimer"
              sensor={sensor}
              setSensor={setSensor}
              disabled={formLock}
            />

            <ParticleValueFormInput
              label="Is In Debug Mode?"
              type="bool"
              keyName="isInDebugMode"
              actualKeyName="actualIsInDebugMode"
              sensor={sensor}
              setSensor={setSensor}
              disabled={formLock}
            />

            {sensor.isInTestMode && <TestModeAlert disabled={formLock} onEndTestMode={handleEndTestMode} />}

            {errorMessages.length > 0 && (
              <Alert variant="danger">
                ERROR:
                <ul>
                  {errorMessages.map(errorMessage => (
                    <li key={errorMessage}>{errorMessage}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <Button variant="primary" className="me-2" type="submit" disabled={formLock}>
              Submit
            </Button>

            <Button variant="danger" type="button" onClick={handleStartTestMode} disabled={formLock || !sensor.isOnline}>
              Start Test Mode
            </Button>

            {formLock && <SpinnerWithTimeEstimate timeEstimate={30} timeEstimateUnits="seconds" />}

            <dl className="fst-italic mt-3">
              <dt>Test Mode</dt>
              <dd>Used when performing system tests with clients. The debug publishes are turned on and the timers are reduced.</dd>
              <dt>Debug Mode</dt>
              <dd>Used when testing a Sensor. The debug publishes are turned on.</dd>
            </dl>
          </Form>
        </>
      )}
    </div>
  )
}

SensorEdit.propTypes = {
  clickupToken: PropTypes.string.isRequired,
  environment: PropTypes.string.isRequired,
}
