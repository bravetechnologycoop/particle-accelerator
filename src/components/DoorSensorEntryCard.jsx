import React, { useEffect, useState } from 'react'
import { Card, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import ActivatedDevice from '../utilities/ActivatedDevice'

function DoorSensorEntryCard(props) {
  const { device, submitDeviceHandler, searchState, selectorState } = props

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

  if (searchState === 'idle' && selectorState !== 'select') {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>
  }

  if (searchState === 'error' && selectorState !== 'select') {
    return <h4>Device Not Found</h4>
  }

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
  device: PropTypes.instanceOf(ActivatedDevice),
  submitDeviceHandler: PropTypes.func,
  searchState: PropTypes.string.isRequired,
  selectorState: PropTypes.string.isRequired,
}

DoorSensorEntryCard.defaultProps = {
  device: new ActivatedDevice(),
  submitDeviceHandler: () => {},
}

export default DoorSensorEntryCard
