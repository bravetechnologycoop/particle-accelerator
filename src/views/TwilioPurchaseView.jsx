import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Card, Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import PhoneNumberStatus from '../components/PhoneNumberStatus'
import { purchaseButtonTwilioNumberByAreaCode, purchaseSensorTwilioNumberByAreaCode } from '../utilities/TwilioFunctions'
import { retTwilioHistory, storeTwilioHistory } from '../utilities/StorageFunctions'

function TwilioPurchaseView(props) {
  const { clickupToken } = props

  const [deviceType, setDeviceType] = useState('sensor')
  const [areaCode, setAreaCode] = useState('')
  const [locationID, setLocationID] = useState('')
  const [formLock, setFormLock] = useState(false)
  const [registrationStatus, setRegistrationStatus] = useState('idle')
  const [history, setHistory] = useState(retTwilioHistory())

  function pushHistory(newAttempt) {
    const attemptArray = [newAttempt]
    const newHistory = [attemptArray].concat(history)
    setHistory(newHistory)
    storeTwilioHistory(newHistory)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setRegistrationStatus('waiting')
    setFormLock(true)

    let twilioNumber

    if (deviceType === 'sensor') {
      twilioNumber = await purchaseSensorTwilioNumberByAreaCode(areaCode, locationID, clickupToken)
    } else if (deviceType === 'buttons') {
      twilioNumber = await purchaseButtonTwilioNumberByAreaCode(areaCode, locationID, clickupToken)
    }

    if (twilioNumber.message === 'success') {
      setRegistrationStatus(twilioNumber.phoneNumber)
    } else {
      setRegistrationStatus('error')
    }

    pushHistory({ friendlyName: twilioNumber.friendlyName, phoneNumber: twilioNumber.phoneNumber, deviceType })

    setLocationID(locationID.replace(/[0-9]/g, ''))

    setFormLock(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Form onSubmit={handleSubmit} style={{ maxWidth: '30ch' }}>
          <Form.Group>
            <Form.Label style={{ paddingTop: '10px' }}>Select Device Type</Form.Label>
            <Form.Control value={deviceType} onChange={x => setDeviceType(x.target.value)} as="select">
              <option id="sensor" key="sensor" value="sensor">
                Sensor
              </option>
              <option id="buttons" key="buttons" value="buttons">
                Buttons
              </option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ paddingTop: '10px' }}>Area Code</Form.Label>
            <Form.Control value={areaCode} onChange={x => setAreaCode(x.target.value)} disabled={formLock} maxLength="3" />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ paddingTop: '10px' }}>Location Name</Form.Label>
            <Form.Control value={locationID} onChange={x => setLocationID(x.target.value)} disabled={formLock} />
          </Form.Group>
          <div style={{ paddingTop: '10px' }}>
            <Button type="submit">Submit</Button>
          </div>
          <div style={{ paddingTop: '10px' }}>
            <h4>
              <PhoneNumberStatus status={registrationStatus} />
            </h4>
          </div>
        </Form>
      </div>
      <div style={{ maxWidth: '30ch', overflowY: 'auto' }}>
        {history.map((attempt, index) => {
          return (
            <li style={{ listStyleType: 'none' }} key={index}>
              <Card>
                <Card.Body>
                  <h4>{attempt.friendlyName}</h4>
                  {attempt.phoneNumber}
                  <br />
                  {attempt.deviceType}
                </Card.Body>
              </Card>
            </li>
          )
        })}
      </div>
    </div>
  )
}

TwilioPurchaseView.propTypes = {
  clickupToken: PropTypes.string.isRequired,
}

export default TwilioPurchaseView
