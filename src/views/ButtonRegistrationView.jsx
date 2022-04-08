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

  async function handleSubmit(event) {
    event.preventDefault()
    setRegistrationStatus('waiting')
    setFormLock(true)
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
        <Form.Label>Device Name</Form.Label>
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
