import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Alert, Badge, Button, Col, Form, Row, Spinner } from 'react-bootstrap'

const { getSensor } = require('../utilities/DatabaseFunctions')

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

  const { clientId, sensorId } = useParams()

  const [loadStatus, setLoadStatus] = useState('idle')
  const [initialized, setInitialized] = useState(false)
  const [sensor, setSensor] = useState({})

  useEffect(() => {
    // no top-level await workaround
    async function load() {
      setLoadStatus('waiting')

      // Get values from DB
      const getSensorResult = await getSensor(sensorId, environment, clickupToken)

      // If FSM:
      //   Get Particle status
      //   If online:
      //     Get door ID
      //     Get initial timer
      //     Get stillness timer
      //     Get duration timer

      if (getSensorResult === null) {
        setLoadStatus('error')
      } else if (getSensorResult.length !== 0) {
        setLoadStatus('success')
        setSensor(getSensorResult)
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

  return (
    <div style={styles.scrollView}>
      <h1 className="mt-10">
        {clientId}&apos;s {sensorId}{' '}
        <a href="https://console.particle.io/production-sensor-devices-15479/devices/e00fce68733ffa3b94f7698d" target="_blank" rel="noreferrer">
          {loadStatus === 'success' && sensor.firmwareStateMachine && (
            <>
              <Badge bg="info">Online</Badge>
              <Badge bg="warning">Offline</Badge>
            </>
          )}
        </a>
      </h1>

      {(loadStatus === 'waiting' || loadStatus === 'idle') && <Spinner animation="border" />}
      {loadStatus === 'success' && (
        <>
          {sensor.firmwareStateMachine && (
            <Alert variant="danger">
              This Sensor may be in <b>TEST MODE</b>!!! (Values in the DB do not match Particle.)
              <Button variant="link" className="float-end pt-0" type="submit">
                End test mode
              </Button>
            </Alert>
          )}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>locationid</Form.Label>
              <Form.Control placeholder={sensor.locationid} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Is this Sensor active?</Form.Label>
              <Form.Select aria-label="Is this Sensor active?">
                <option value="true" selected={sensor.isActive}>
                  Yes
                </option>
                <option value="false" selected={!sensor.isActive}>
                  No
                </option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Display Name</Form.Label>
              <Form.Control type="text" value={sensor.displayName} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Client</Form.Label>
              <Form.Select aria-label="Client">
                {sensor.clients &&
                  sensor.clients.map(client => {
                    return (
                      <option value={client.id} key={client.id} selected={client.id === sensor.clientId}>
                        {client.displayName}
                      </option>
                    )
                  })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Door Particle Core ID</Form.Label>
              <Form.Control type="text" value={sensor.doorCoreId} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Radar Particle Core ID</Form.Label>
              <Form.Control type="text" value={sensor.radarCoreId} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" value={sensor.phoneNumber} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Does this Sensor use a firmware state machine?</Form.Label>
              <Form.Select aria-label="Does this Sensor use a firmware state machine">
                <option value="true" selected={sensor.firmwareStateMachine}>
                  Yes
                </option>
                <option value="false" selected={!sensor.firmwareStaetMachine}>
                  No
                </option>
              </Form.Select>
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Label>Door ID</Form.Label>
                <Form.Control type="text" value={sensor.doorId} />
              </Col>
              <Col>
                <Form.Label>Actual Door ID</Form.Label>
                <Form.Control type="text" disabled />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Movement Threshold</Form.Label>
                <Form.Control type="text" value={sensor.movementThreshold} />
              </Col>
              <Col>
                <Form.Label>Actual Movement Threshold</Form.Label>
                <Form.Control type="text" disabled />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Initial Timer (seconds)</Form.Label>
                <Form.Control type="text" value={sensor.initialTimer} />
              </Col>
              <Col>
                <Form.Label>Actual Initial Timer (seconds)</Form.Label>
                <Form.Control type="text" disabled />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Duration Timer (seconds)</Form.Label>
                <Form.Control type="text" value={sensor.durationTimer} />
              </Col>
              <Col>
                <Form.Label>Actual Duration Timer (seconds)</Form.Label>
                <Form.Control type="text" disabled />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Stillness Timer (seconds)</Form.Label>
                <Form.Control type="text" value={sensor.stillnessTimer} />
              </Col>
              <Col>
                <Form.Label>Actual Stillness Timer (seconds)</Form.Label>
                <Form.Control type="text" disabled />
              </Col>
            </Row>

            {sensor.firmwareStateMachine && (
              <Alert variant="danger">
                This Sensor may be in <b>TEST MODE</b>!!! (Values in the DB do not match Particle.)
                <Button variant="link" className="float-end pt-0" type="submit">
                  End test mode
                </Button>
              </Alert>
            )}

            <Button variant="primary" className="mr-1" type="submit">
              Submit
            </Button>

            {sensor.firmwareStateMachine && (
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
}
