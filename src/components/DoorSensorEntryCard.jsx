import React, { useState } from 'react'
import { Card, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import ActivatedDevice from '../utilities/ActivatedDevice'

function DoorSensorEntryCard(props) {
  const { device, submitDeviceHandler } = props

  const [doorSensorID, setDoorSensorID] = useState('')

  return (
    <Card style={{ padding: '10px' }}>
      <h4>{device.deviceName}</h4>
      <Form onSubmit={submitDeviceHandler(device, doorSensorID)}>
        <Form.Label>Pair Door Sensor</Form.Label>
        <Form.Control placeholder="a1,b2,c3" value={doorSensorID} maxLength="8" onChange={x => setDoorSensorID(x.target.value)} />
        <div style={{ paddingTop: '10px' }}>
          <Button variant="primary" type="submit">
            Add to Queue
          </Button>
        </div>
      </Form>
    </Card>
  )
}

DoorSensorEntryCard.propTypes = {
  device: PropTypes.arrayOf(PropTypes.instanceOf(ActivatedDevice)),
  submitDeviceHandler: PropTypes.func,
}

DoorSensorEntryCard.defaultProps = {
  device: new ActivatedDevice(),
  submitDeviceHandler: () => {},
}

export default DoorSensorEntryCard
