// Third-party dependencies
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Alert, Badge, Button, Col, Form, Row } from 'react-bootstrap'

// In-house dependences
import SpinnerWithTimeEstimate from '../components/general/SpinnerWithTimeEstimate'
import { Environments } from '../utilities/Constants'

const { endTestMode, getSensor, startTestMode, updateSensor } = require('../utilities/DatabaseFunctions')

const styles = {
  mismatchedValue: {
    backgroundColor: '#f8d7da',
  },
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

  function displayTestModeAlert() {
    return (
      sensor.isOnline &&
      (parseInt(sensor.doorId, 10) !== parseInt(sensor.actualDoorId, 10) ||
        parseInt(sensor.movementThreshold, 10) !== parseInt(sensor.actualMovementThreshold, 10) ||
        parseInt(sensor.initialTimer, 10) !== parseInt(sensor.actualInitialTimer, 10) ||
        parseInt(sensor.durationTimer, 10) !== parseInt(sensor.actualDurationTimer, 10) ||
        parseInt(sensor.stillnessTimer, 10) !== parseInt(sensor.actualStillnessTimer, 10))
    )
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
          {displayTestModeAlert(sensor) && (
            <Alert variant="danger">
              This Sensor may be in <b>TEST MODE</b>!!! (Values in the DB do not match Particle.)
              <Button variant="link" className="float-end pt-0" type="button" onClick={handleEndTestMode} disabled={formLock}>
                End test mode
              </Button>
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

            <Row className="mb-3">
              <Col>
                <Form.Label>Door ID</Form.Label>
                <Form.Control
                  type="text"
                  value={sensor.doorId}
                  disabled={formLock || !sensor.isOnline}
                  onChange={x => setSensor({ ...sensor, doorId: x.target.value })}
                />
              </Col>
              <Col>
                <Form.Label>Actual Door ID</Form.Label>
                <Form.Control
                  type="text"
                  value={sensor.isOnline ? sensor.actualDoorId : 'Unknown (Particle offline)'}
                  style={sensor.isOnline && parseInt(sensor.doorId, 16) !== parseInt(sensor.actualDoorId, 16) ? styles.mismatchedValue : {}}
                  disabled
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Movement Threshold</Form.Label>
                <Form.Control
                  type="text"
                  value={sensor.movementThreshold}
                  onChange={x => setSensor({ ...sensor, movementThreshold: x.target.value })}
                  disabled={formLock || !sensor.isOnline}
                />
              </Col>
              <Col>
                <Form.Label>Actual Movement Threshold</Form.Label>
                <Form.Control
                  type="text"
                  value={sensor.isOnline ? sensor.actualMovementThreshold : 'Unknown (Particle offline)'}
                  style={
                    sensor.isOnline && parseInt(sensor.movementThreshold, 10) !== parseInt(sensor.actualMovementThreshold, 10)
                      ? styles.mismatchedValue
                      : {}
                  }
                  disabled
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Initial Timer (seconds)</Form.Label>
                <Form.Control
                  type="text"
                  value={sensor.initialTimer}
                  onChange={x => setSensor({ ...sensor, initialTimer: x.target.value })}
                  disabled={formLock || !sensor.isOnline}
                />
              </Col>
              <Col>
                <Form.Label>Actual Initial Timer (seconds)</Form.Label>
                <Form.Control
                  type="text"
                  value={sensor.isOnline ? sensor.actualInitialTimer : 'Unknown (Particle offline)'}
                  style={
                    sensor.isOnline && parseInt(sensor.initialTimer, 10) !== parseInt(sensor.actualInitialTimer, 10) ? styles.mismatchedValue : {}
                  }
                  disabled
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Duration Timer (seconds)</Form.Label>
                <Form.Control
                  type="text"
                  value={sensor.durationTimer}
                  onChange={x => setSensor({ ...sensor, durationTimer: x.target.value })}
                  disabled={formLock || !sensor.isOnline}
                />
              </Col>
              <Col>
                <Form.Label>Actual Duration Timer (seconds)</Form.Label>
                <Form.Control
                  type="text"
                  value={sensor.isOnline ? sensor.actualDurationTimer : 'Unknown (Particle offline)'}
                  style={
                    sensor.isOnline && parseInt(sensor.durationTimer, 10) !== parseInt(sensor.actualDurationTimer, 10) ? styles.mismatchedValue : {}
                  }
                  disabled
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Stillness Timer (seconds)</Form.Label>
                <Form.Control
                  type="text"
                  value={sensor.stillnessTimer}
                  onChange={x => setSensor({ ...sensor, stillnessTimer: x.target.value })}
                  disabled={formLock || !sensor.isOnline}
                />
              </Col>
              <Col>
                <Form.Label>Actual Stillness Timer (seconds)</Form.Label>
                <Form.Control
                  type="text"
                  value={sensor.isOnline ? sensor.actualStillnessTimer : 'Unknown (Particle offline)'}
                  style={
                    sensor.isOnline && parseInt(sensor.stillnessTimer, 10) !== parseInt(sensor.actualStillnessTimer, 10) ? styles.mismatchedValue : {}
                  }
                  disabled
                />
              </Col>
            </Row>

            {displayTestModeAlert() && (
              <Alert variant="danger">
                This Sensor may be in <b>TEST MODE</b>!!! (Values in the DB do not match Particle.)
                <Button variant="link" className="float-end pt-0" type="button" onClick={handleEndTestMode} disabled={formLock}>
                  End test mode
                </Button>
              </Alert>
            )}

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
