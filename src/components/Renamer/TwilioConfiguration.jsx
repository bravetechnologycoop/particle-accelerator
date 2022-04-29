import { Card, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'

function TwilioConfiguration(props) {
  const { twilioCheck, twilioCountryCode, changeTwilioCountryCode, twilioCityName, changeTwilioCityName } = props
  if (twilioCheck) {
    return (
      <Card>
        <Card.Header>Twilio Configuration</Card.Header>
        <div style={{ padding: '10px' }}>
          <Form.Group>
            <Form.Label style={{ paddingTop: '10px' }}>Phone Number Area Code</Form.Label>
            <Form.Control placeholder="Area Code" value={twilioCityName} onChange={x => changeTwilioCityName(x.target.value)} />
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
  twilioCountryCode: PropTypes.string.isRequired,
  changeTwilioCountryCode: PropTypes.func.isRequired,
  twilioCityName: PropTypes.string.isRequired,
  changeTwilioCityName: PropTypes.func.isRequired,
}

export default TwilioConfiguration
