import React, { useEffect, useState } from 'react'
import { Card, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import ActivatedDevice from '../../utilities/ActivatedDevice'

/**
 * DoorSensorEntryCard
 *
 * React Component for allowing a user to input an IM21 Door ID and submit it to the queue in the DoorSensorPairing.jsx view.
 *
 * @param {ActivatedDevice} props.device Device that the card represents
 * @param {function} props.submitDeviceHandler Function that submits the device to the queue
 * @param {string} props.searchState current state of searching for the said device that the component is in (soon to be deprecated)
 * @param {string} props.selectorState current state of the radio button that controls which method to obtain a device by (soon to be deprecated)
 * @return {JSX.Element}
 */
function DoorSensorEntryCard(props) {
  const { device, submitDeviceHandler } = props

  const [doorSensorID, setDoorSensorID] = useState('')
  const [buttonStyle, setButtonStyle] = useState('primary')
  const [buttonText, setButtonText] = useState('Add to Queue')

  const doorSensorIDRegex = /^[a-f0-9]{2}[,][a-f0-9]{2}[,][a-f0-9]{2}$/

  useEffect(() => {
    if (device.inPairingList === false && buttonStyle !== 'danger') {
      setButtonStyle('primary')
      setButtonText('Add to Queue')
    }
  })

  return (
    <Card style={{ padding: '10px' }} key={`${device.dateStamp}${device.timeStamp}`}>
      <h4>{device.deviceName}</h4>
      <Form
        onSubmit={event => {
          event.preventDefault()
          if (doorSensorIDRegex.test(doorSensorID)) {
            submitDeviceHandler(device, doorSensorID)
            setButtonStyle('success')
            setButtonText('Added to Queue')
          } else {
            setButtonStyle('danger')
            setButtonText('Incorrect Formatting, Try Again')
          }
        }}
      >
        <Form.Label>Pair Door Sensor</Form.Label>
        <Form.Control
          placeholder="a1,b2,c3"
          value={doorSensorID}
          maxLength="8"
          onChange={x => {
            setDoorSensorID(x.target.value)
          }}
        />
        <div style={{ paddingTop: '10px' }}>
          <Button variant={buttonStyle} type="submit" disabled={buttonStyle === 'success'}>
            {buttonText}
          </Button>
        </div>
      </Form>
    </Card>
  )
}

DoorSensorEntryCard.propTypes = {
  device: PropTypes.instanceOf(ActivatedDevice).isRequired,
  submitDeviceHandler: PropTypes.func.isRequired,
}

export default DoorSensorEntryCard
