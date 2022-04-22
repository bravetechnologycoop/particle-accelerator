import React, { useState } from 'react'
import { Badge, Form, Spinner } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import { registerLoraButton } from '../utilities/AWSFunctions'

export default function ButtonRegistrationView(props) {
  const { clickupToken } = props

  const [deviceEUI, setDeviceEUI] = useState('')
  const [deviceName, setDeviceName] = useState('')
  const [formLock, setFormLock] = useState(false)
  const [registrationStatus, setRegistrationStatus] = useState('idle')
  const [environment, setEnvironment] = useState('dev')

  async function handleSubmit(event) {
    event.preventDefault()
    setRegistrationStatus('waiting')
    setFormLock(true)

    /*
    If statement for production/development would go here.

    for example:

    let awsRegistration

    if (environment === 'dev') {
      awsRegistration = await registerLoraButton(environment/url, deviceEUI, deviceName, clickupToken)
    } else if (environment === 'prod') {
      awsRegistration = await registerLoraButton(environment/url, deviceEUI, deviceName, clickupToken)
    } else {
      setRegistrationStatus('error')
    }
     */

    const awsRegistration = await registerLoraButton(deviceEUI, deviceName, clickupToken)

    if (awsRegistration === 'success') {
      setRegistrationStatus(awsRegistration)
    } else {
      setRegistrationStatus(awsRegistration)
    }

    setDeviceEUI('')
    setFormLock(false)
  }

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: '30ch' }}>
      <Form.Group>
        <Form.Label>Select Environment</Form.Label>
        <Form.Control as="select" value={environment} onChange={x => setEnvironment(x.target.value)}>
          <option id="dev" key="dev" value="dev">
            Development
          </option>
          <option id="prod" key="prod" value="prod">
            Production
          </option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label style={{ paddingTop: '10px' }}>Device Name</Form.Label>
        <Form.Control value={deviceName} onChange={x => setDeviceName(x.target.value)} disabled={formLock} />
      </Form.Group>
      <Form.Group>
        <Form.Label style={{ paddingTop: '10px' }}>Device EUI</Form.Label>
        <Form.Control value={deviceEUI} onChange={x => setDeviceEUI(x.target.value)} disabled={formLock} />
      </Form.Group>
      <div style={{ paddingTop: '10px' }}>
        <Button type="submit">Submit</Button>
      </div>
      <div style={{ paddingTop: '10px' }}>
        <RegistrationIcon status={registrationStatus} />
      </div>
    </Form>
  )
}

ButtonRegistrationView.propTypes = {
  clickupToken: PropTypes.string.isRequired,
}

function RegistrationIcon(props) {
  const { status } = props

  if (status === 'waiting') {
    return <Spinner animation="border" />
  }
  if (status === 'success') {
    return <Badge bg="success">Success</Badge>
  }
  if (status.includes('Error')) {
    return <Badge bg="danger">{status}</Badge>
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>
}

RegistrationIcon.propTypes = {
  status: PropTypes.string.isRequired,
}
