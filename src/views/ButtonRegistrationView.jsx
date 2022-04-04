import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { registerLoraButton } from '../utilities/AWSFunctions'

export default function ButtonRegistrationView() {
  const [deviceEUI, setDeviceEUI] = useState('')
  const [deviceName, setDeviceName] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setDeviceEUI('')
    setDeviceName('')
    registerLoraButton(deviceEUI, deviceName)
  }

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: '30ch' }}>
      <Form.Group>
        <Form.Label>Device Name</Form.Label>
        <Form.Control value={deviceName} onChange={x => setDeviceName(x.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Label style={{ paddingTop: '10px' }}>Device EUI</Form.Label>
        <Form.Control value={deviceEUI} onChange={x => setDeviceEUI(x.target.value)} />
      </Form.Group>
      <div style={{ paddingTop: '10px' }}>
        <Button type="submit">Submit</Button>
      </div>
    </Form>
  )
}
