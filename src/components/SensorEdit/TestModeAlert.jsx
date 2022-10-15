// Third-party dependencies
import React from 'react'
import { Alert, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

export default function TestModeAlert(props) {
  const { onEndTestMode, disabled } = props

  return (
    <Alert variant="danger">
      <Button variant="link" className="float-end pt-0" type="button" onClick={onEndTestMode} disabled={disabled}>
        End Test Mode
      </Button>
      <p>
        This Sensor is in <b>TEST MODE</b>!!!
      </p>
    </Alert>
  )
}

TestModeAlert.propTypes = {
  onEndTestMode: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
}
