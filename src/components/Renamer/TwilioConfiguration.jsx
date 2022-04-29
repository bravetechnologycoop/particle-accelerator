import { Card, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'

function TwilioConfiguration(props) {
  const { twilioCheck, twilioAreaCode, changeTwilioAreaCode } = props
  if (twilioCheck) {
    return (
      <Card>
        <Card.Header>Twilio Configuration</Card.Header>
        <div style={{ padding: '10px' }}>
          <Form.Group>
            <Form.Label style={{ paddingTop: '10px' }}>Phone Number Area Code</Form.Label>
            <Form.Control placeholder="Area Code" value={twilioAreaCode} onChange={x => changeTwilioAreaCode(x.target.value)} />
          </Form.Group>
        </div>
      </Card>
    )
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>
}

TwilioConfiguration.propTypes = {
  twilioCheck: PropTypes.bool.isRequired,
  twilioAreaCode: PropTypes.string.isRequired,
  changeTwilioAreaCode: PropTypes.func.isRequired,
}

export default TwilioConfiguration
