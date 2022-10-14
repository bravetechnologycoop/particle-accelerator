// Third-party dependencies
import React from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'

export default function ParticleValueFormInput(props) {
  const { sensor, setSensor, keyName, actualKeyName, label, disabled, radix } = props

  const styles = {
    mismatchedValue: {
      backgroundColor: '#f8d7da',
    },
  }

  return (
    <Row className="mb-3">
      <Col>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type="text"
          value={sensor[keyName] || ''}
          onChange={x => setSensor({ ...sensor, [keyName]: x.target.value })}
          disabled={!sensor.isOnline || disabled}
        />
      </Col>
      <Col>
        <Form.Label>Actual {label}</Form.Label>
        <Form.Control
          type="text"
          value={sensor.isOnline ? sensor[actualKeyName] : 'Unknown (Particle offline)'}
          style={sensor.isOnline && parseInt(sensor[keyName], radix) !== parseInt(sensor[actualKeyName], radix) ? styles.mismatchedValue : {}}
          disabled
        />
      </Col>
    </Row>
  )
}

ParticleValueFormInput.propTypes = {
  label: PropTypes.string.isRequired,
  keyName: PropTypes.string.isRequired,
  actualKeyName: PropTypes.string.isRequired,
  sensor: PropTypes.shape({
    isOnline: PropTypes.bool,
  }).isRequired,
  setSensor: PropTypes.func.isRequired,
  radix: PropTypes.number,
  disabled: PropTypes.bool.isRequired,
}

ParticleValueFormInput.defaultProps = {
  radix: 10,
}
