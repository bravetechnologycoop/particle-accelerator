import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Alert, Badge, Button, Col, Form, Row, Spinner } from 'react-bootstrap'

const { getSensor, updateSensor } = require('../utilities/DatabaseFunctions')
const {
  getDeviceDetailsByDeviceId,
  getDurationTimer,
  getInitialTimer,
  getMovementThreshold,
  getStillnessTimer,
} = require('../utilities/ParticleFunctions')

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
  const { clickupToken, environment, particleToken } = props

  const { clientId, sensorId } = useParams()

  const [loadStatus, setLoadStatus] = useState('idle')
  const [initialized, setInitialized] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState('idle')
  const [sensor, setSensor] = useState({})
  const [modifiedSensor, setModifiedSensor] = useState({})
  const [errorMessages, setErrorMessages] = useState([])
  const [formLock, setFormLock] = useState(false)

  // Load the initial values
  useEffect(() => {
    // no top-level await workaround
    async function load() {
      setLoadStatus('waiting')

      // Get values from DB
      const initialSensorData = await getSensor(sensorId, environment, clickupToken)

      // Get values from Particle, if it's online
      if (initialSensorData && initialSensorData.firmwareStateMachine) {
        const details = await getDeviceDetailsByDeviceId(initialSensorData.radarCoreId, particleToken)

        if (details && details.online) {
          initialSensorData.isOnline = true
          initialSensorData.actualMovementThreshold = await getMovementThreshold(initialSensorData.radarCoreId, particleToken)
          initialSensorData.actualInitialTimer = await getInitialTimer(initialSensorData.radarCoreId, particleToken)
          initialSensorData.actualDurationTimer = await getDurationTimer(initialSensorData.radarCoreId, particleToken)
          initialSensorData.actualStillnessTimer = await getStillnessTimer(initialSensorData.radarCoreId, particleToken)

          // TODO Get door ID
        }
      }

      if (initialSensorData === null) {
        setLoadStatus('error')
      } else if (initialSensorData.length !== 0) {
        setLoadStatus('success')
        setSensor(initialSensorData)
        setModifiedSensor(initialSensorData)
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
    setSubmissionStatus('waiting')
    setErrorMessages([])
    setFormLock(true)

    const errors = []

    // If online:
    if (modifiedSensor.doorId !== sensor.doorId) {
      console.log(`TODO update Door ID in Particle`)
      // If error:
      errors.push('Error updating the Door ID in Particle, please try again later.')
    }
    if (modifiedSensor.initialTimer !== sensor.initialTimer) {
      console.log(`TODO update initialTimer in Particle`)
      // If error:
      errors.push('Error updating the initialTimer in Particle, please try again later.')
    }
    if (modifiedSensor.durationTimer !== sensor.durationTimer) {
      console.log(`TODO update durationTimer in Particle`)
      // If error:
      errors.push('Error updating the durationTimer in Particle, please try again later.')
    }
    if (modifiedSensor.stillnessTimer !== sensor.stillnessTimer) {
      console.log(`TODO update stillnessTimer in Particle`)
      // If error:
      errors.push('Error updating the stillnessTimer in Particle, please try again later.')
    }

    // Update DB
    const response = await updateSensor(
      modifiedSensor.locationid,
      modifiedSensor.displayName,
      modifiedSensor.movementThreshold,
      modifiedSensor.durationTimer,
      modifiedSensor.stillnessTimer,
      modifiedSensor.doorCoreId,
      modifiedSensor.radarCoreId,
      modifiedSensor.phoneNumber,
      modifiedSensor.initialTimer,
      modifiedSensor.isActive,
      modifiedSensor.firmwareStateMachine,
      modifiedSensor.doorId,
      modifiedSensor.clientId,
      environment,
      clickupToken,
    )

    if (response.message === 'success') {
      setSubmissionStatus('success')
      setSensor(modifiedSensor)
    } else {
      errors.push(response.message)
    }

    console.log(`***TKD errors: ${JSON.stringify(errors)}`)
    if (errors.length > 0) {
      setErrorMessages(errors)
    }

    setSubmissionStatus('idle')
    setFormLock(false)
  }

  function displayTestModeAlert() {
    return (
      (modifiedSensor.isOnline && parseInt(modifiedSensor.doorId, 10) !== parseInt(modifiedSensor.actualDoorId, 10)) ||
      parseInt(modifiedSensor.movementThreshold, 10) !== parseInt(modifiedSensor.actualMovementThreshold, 10) ||
      parseInt(modifiedSensor.initialTimer, 10) !== parseInt(modifiedSensor.actualInitialTimer, 10) ||
      parseInt(modifiedSensor.durationTimer, 10) !== parseInt(modifiedSensor.actualDurationTimer, 10) ||
      parseInt(modifiedSensor.stillnessTimer, 10) !== parseInt(modifiedSensor.actualStillnessTimer, 10)
    )
  }

  return (
    <div style={styles.scrollView}>
      <h1 className="mt-10">
        {clientId}&apos;s {sensorId}{' '}
        <a href="https://console.particle.io/production-sensor-devices-15479/devices/e00fce68733ffa3b94f7698d" target="_blank" rel="noreferrer">
          {loadStatus === 'success' && sensor.firmwareStateMachine === 'Yes' && (
            <>
              {modifiedSensor.isOnline && <Badge bg="info">Online</Badge>}
              {!modifiedSensor.isOnline && <Badge bg="warning">Offline</Badge>}
              {modifiedSensor === {} && <Badge bg="danger">Not Found</Badge>}
            </>
          )}
        </a>
      </h1>

      {(loadStatus === 'waiting' || loadStatus === 'idle') && <Spinner animation="border" />}

      {loadStatus === 'success' && (
        <>
          {sensor.firmwareStateMachine === 'Yes' && displayTestModeAlert(modifiedSensor) && (
            <Alert variant="danger">
              This Sensor may be in <b>TEST MODE</b>!!! (Values in the DB do not match Particle.)
              <Button variant="link" className="float-end pt-0" type="submit">
                End test mode
              </Button>
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>locationid</Form.Label>
              <Form.Control placeholder={modifiedSensor.locationid} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Is this Sensor active?</Form.Label>
              <Form.Select
                aria-label="Is this Sensor active?"
                onChange={x => setModifiedSensor({ ...modifiedSensor, isActive: x.target.value })}
                value={modifiedSensor.isActive}
                disabled={formLock}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Display Name</Form.Label>
              <Form.Control
                type="text"
                value={modifiedSensor.displayName}
                onChange={x => setModifiedSensor({ ...modifiedSensor, displayName: x.target.value })}
                disabled={formLock}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Client</Form.Label>
              <Form.Select
                aria-label="Client"
                onChange={x => setModifiedSensor({ ...modifiedSensor, clientId: x.target.value })}
                value={modifiedSensor.clientId}
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
              <Form.Label>Door Particle Core ID</Form.Label>
              <Form.Control
                type="text"
                value={modifiedSensor.doorCoreId}
                onChange={x => setModifiedSensor({ ...modifiedSensor, doorCoreId: x.target.value })}
                disabled={formLock}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Radar Particle Core ID</Form.Label>
              <Form.Control
                type="text"
                value={modifiedSensor.radarCoreId}
                onChange={x => setModifiedSensor({ ...modifiedSensor, radarCodeId: x.target.value })}
                disabled={formLock}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={modifiedSensor.phoneNumber}
                onChange={x => setModifiedSensor({ ...modifiedSensor, phoneNumber: x.target.value })}
                disabled={formLock}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Does this Sensor use a firmware state machine?</Form.Label>
              <Form.Select
                aria-label="Does this Sensor use a firmware state machine"
                onChange={x => setModifiedSensor({ ...modifiedSensor, firmwareStateMachine: x.target.value })}
                value={modifiedSensor.firmwareStateMachine}
                disabled={formLock}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Form.Select>
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Label>Door ID</Form.Label>
                <Form.Control
                  type="text"
                  value={modifiedSensor.doorId}
                  disabled={formLock || !modifiedSensor.isOnline}
                  onChange={x => setModifiedSensor({ ...modifiedSensor, doorId: x.target.value })}
                />
              </Col>
              <Col>
                <Form.Label>Actual Door ID</Form.Label>
                <Form.Control
                  type="text"
                  value={modifiedSensor.isOnline ? modifiedSensor.actualDoorId : 'Unknown (Particle offline)'}
                  style={
                    modifiedSensor.isOnline && parseInt(modifiedSensor.doorId, 16) !== parseInt(modifiedSensor.actualDoorId, 16)
                      ? styles.mismatchedValue
                      : {}
                  }
                  disabled
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Movement Threshold</Form.Label>
                <Form.Control
                  type="text"
                  value={modifiedSensor.movementThreshold}
                  onChange={x => setModifiedSensor({ ...modifiedSensor, movementThreshold: x.target.value })}
                  disabled={formLock || !modifiedSensor.isOnline}
                />
              </Col>
              <Col>
                <Form.Label>Actual Movement Threshold</Form.Label>
                <Form.Control
                  type="text"
                  value={modifiedSensor.isOnline ? modifiedSensor.actualMovementThreshold : 'Unknown (Particle offline)'}
                  style={
                    modifiedSensor.isOnline && parseInt(modifiedSensor.movementThreshold, 10) !== parseInt(modifiedSensor.actualMovementThreshold, 10)
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
                  value={modifiedSensor.initialTimer}
                  onChange={x => setModifiedSensor({ ...modifiedSensor, initialTimer: x.target.value })}
                  disabled={formLock || !modifiedSensor.isOnline}
                />
              </Col>
              <Col>
                <Form.Label>Actual Initial Timer (seconds)</Form.Label>
                <Form.Control
                  type="text"
                  value={modifiedSensor.isOnline ? modifiedSensor.actualInitialTimer : 'Unknown (Particle offline)'}
                  style={
                    modifiedSensor.isOnline && parseInt(modifiedSensor.initialTimer, 10) !== parseInt(modifiedSensor.actualInitialTimer, 10)
                      ? styles.mismatchedValue
                      : {}
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
                  value={modifiedSensor.durationTimer}
                  onChange={x => setModifiedSensor({ ...modifiedSensor, durationTimer: x.target.value })}
                  disabled={formLock || !modifiedSensor.isOnline}
                />
              </Col>
              <Col>
                <Form.Label>Actual Duration Timer (seconds)</Form.Label>
                <Form.Control
                  type="text"
                  value={modifiedSensor.isOnline ? modifiedSensor.actualDurationTimer : 'Unknown (Particle offline)'}
                  style={
                    modifiedSensor.isOnline && parseInt(modifiedSensor.durationTimer, 10) !== parseInt(modifiedSensor.actualDurationTimer, 10)
                      ? styles.mismatchedValue
                      : {}
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
                  value={modifiedSensor.stillnessTimer}
                  onChange={x => setModifiedSensor({ ...modifiedSensor, stillnessTimer: x.target.value })}
                  disabled={formLock || !modifiedSensor.isOnline}
                />
              </Col>
              <Col>
                <Form.Label>Actual Stillness Timer (seconds)</Form.Label>
                <Form.Control
                  type="text"
                  value={modifiedSensor.isOnline ? modifiedSensor.actualStillnessTimer : 'Unknown (Particle offline)'}
                  style={
                    modifiedSensor.isOnline && parseInt(modifiedSensor.stillnessTimer, 10) !== parseInt(modifiedSensor.actualStillnessTimer, 10)
                      ? styles.mismatchedValue
                      : {}
                  }
                  disabled
                />
              </Col>
            </Row>

            {sensor.firmwareStateMachine === 'Yes' && displayTestModeAlert() && (
              <Alert variant="danger">
                This Sensor may be in <b>TEST MODE</b>!!! (Values in the DB do not match Particle.)
                <Button variant="link" className="float-end pt-0" type="submit">
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

            {submissionStatus !== 'waiting' && (
              <Button variant="primary" className="mr-1" type="submit">
                Submit
              </Button>
            )}
            {submissionStatus === 'waiting' && <Spinner animation="border" />}

            {sensor.firmwareStateMachine === 'Yes' && (
              <Button variant="danger" type="submit">
                Start Test Mode
              </Button>
            )}
          </Form>
        </>
      )}
    </div>
  )
}

SensorEdit.propTypes = {
  clickupToken: PropTypes.string.isRequired,
  environment: PropTypes.string.isRequired,
  particleToken: PropTypes.string.isRequired,
}
