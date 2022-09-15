import React from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Alert, Badge, Button, Col, Form, Row } from 'react-bootstrap'

export default function SensorEdit(props) {
  // eslint-disable-next-line no-unused-vars
  const { clickupToken, environment } = props

  const { clientId, sensorId } = useParams()
  const clientDisplayName = 'Hardcoded Client Name'

  const styles = {
    scrollView: {
      overflow: 'auto',
      paddingRight: '10px',
      paddingLeft: '10px',
      paddingBottom: '10px',
    },
  }

  return (
    <div style={styles.scrollView}>
      <h1 className="mt-10">
        {clientId}&apos;s {sensorId}{' '}
        <a href="https://console.particle.io/production-sensor-devices-15479/devices/e00fce68733ffa3b94f7698d" target="_blank" rel="noreferrer">
          {/* TODO Badge type and text changes based on status. Should something completely different for Argons */}
          <Badge bg="info">Online</Badge>
          <Badge bg="warning">Offline</Badge>
        </a>
      </h1>

      <Alert variant="danger">
        This Sensor may be in <b>TEST MODE</b>!!! (Values in the DB do to match Particle or the device is in debug mode)
        <Button variant="link" className="float-end pt-0" type="submit">
          End test mode
        </Button>
      </Alert>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>locationid</Form.Label>
          <Form.Control placeholder={sensorId} disabled />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Is this Sensor active?</Form.Label>
          <Form.Select aria-label="Is this Sensor active?">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Display Name</Form.Label>
          <Form.Control type="text" />
        </Form.Group>

        {/* TODO Get full list of clients to display here */}
        <Form.Group className="mb-3">
          <Form.Label>Client</Form.Label>
          <Form.Select aria-label="Client">
            <option value={clientId}>{clientDisplayName}</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Door Particle Core ID</Form.Label>
          <Form.Control type="text" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Radar Particle Core ID</Form.Label>
          <Form.Control type="text" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control type="text" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Does this Sensor use a firmware state machine?</Form.Label>
          <Form.Select aria-label="Does this Sensor use a firmware state machine">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Form.Select>
        </Form.Group>

        <Row className="mb-3">
          <Col>
            <Form.Label>Door ID</Form.Label>
            <Form.Control type="text" />
          </Col>
          <Col>
            <Form.Label>Actual Door ID</Form.Label>
            <Form.Control type="text" disabled />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Label>Movement Threshold</Form.Label>
            <Form.Control type="text" />
          </Col>
          <Col>
            <Form.Label>Actual Movement Threshold</Form.Label>
            <Form.Control type="text" disabled />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Label>Initial Timer (seconds)</Form.Label>
            <Form.Control type="text" />
          </Col>
          <Col>
            <Form.Label>Actual Initial Timer (seconds)</Form.Label>
            <Form.Control type="text" disabled />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Label>Duration Timer (seconds)</Form.Label>
            <Form.Control type="text" />
          </Col>
          <Col>
            <Form.Label>Actual Duration Timer (seconds)</Form.Label>
            <Form.Control type="text" disabled />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Label>Stillness Timer (seconds)</Form.Label>
            <Form.Control type="text" />
          </Col>
          <Col>
            <Form.Label>Actual Stillness Timer (seconds)</Form.Label>
            <Form.Control type="text" disabled />
          </Col>
        </Row>

        <Alert variant="danger">
          This Sensor may be in <b>TEST MODE</b>!!! (Values in the DB do to match Particle or the device is in debug mode)
          <Button variant="link" className="float-end pt-0" type="submit">
            End test mode
          </Button>
        </Alert>

        <Button variant="primary" className="mr-1" type="submit">
          Submit
        </Button>

        <Button variant="danger" type="submit">
          Start Test Mode
        </Button>
      </Form>
    </div>
  )
}

SensorEdit.propTypes = {
  clickupToken: PropTypes.string.isRequired,
  environment: PropTypes.string.isRequired,
}
