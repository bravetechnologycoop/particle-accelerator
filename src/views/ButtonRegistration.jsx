import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { useCookies } from 'react-cookie'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import { registerLoraButton } from '../utilities/AWSFunctions'
import RegistrationIcon from '../components/ButtonRegistration/RegistrationIcon'

export default function ButtonRegistration(props) {
  // eslint-disable-next-line no-unused-vars
  const { environment } = props

  const [deviceEUI, setDeviceEUI] = useState('')
  const [deviceName, setDeviceName] = useState('')
  const [formLock, setFormLock] = useState(false)
  const [registrationStatus, setRegistrationStatus] = useState('idle')
  const [cookies] = useCookies(['googleIdToken'])

  async function handleSubmit(event) {
    event.preventDefault()
    setRegistrationStatus('waiting')
    setFormLock(true)

    const awsRegistration = await registerLoraButton(deviceEUI, deviceName, environment, cookies.googleIdToken)

    if (awsRegistration === 'success') {
      setRegistrationStatus(awsRegistration)
    } else {
      setRegistrationStatus(awsRegistration)
    }

    setDeviceEUI('')
    setFormLock(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', padding: 20 }}>
      <Form onSubmit={handleSubmit} style={{ maxWidth: '30ch' }}>
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
    </div>
  )
}

ButtonRegistration.propTypes = {
  environment: PropTypes.string.isRequired,
}
