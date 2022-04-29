import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import React from 'react'
import ActivatedDevice from '../../utilities/ActivatedDevice'

function uppercase(text) {
  return text.replace(/(^\w)|(\s+\w)/g, letter => letter.toUpperCase())
}

function ActivatedDeviceDisplay(props) {
  const { device, deleteDevice } = props

  let twilioNumber
  let doorSensorID

  if (device.doorSensorID === '' || device.doorSensorID === undefined) {
    doorSensorID = 'No Door Sensor ID'
  } else {
    doorSensorID = device.doorSensorID
  }

  if (device.twilioNumber === '' || device.twilioNumber === undefined) {
    twilioNumber = 'No Twilio Number'
  } else {
    twilioNumber = device.twilioNumber
  }

  return (
    <div style={{ padding: '10px', maxWidth: '500px' }}>
      <div
        style={{
          borderRadius: '5px',
          maxWidth: '100%',
          border: '2px solid black',
          display: 'flex',
          flexDirection: 'row',
          height: '100%',
          backgroundClip: 'border-box',
        }}
      >
        <div
          style={{
            flex: '1 1',
            backgroundColor: device.clickupStatusColour,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomRightRadius: '3px',
            borderTopRightRadius: '3px',
            textAlign: 'center',
            padding: '5px',
            writingMode: 'vertical-lr',
            transform: 'rotate(180deg)',
          }}
        >
          {uppercase(device.clickupStatus)}
        </div>
        <div style={{ flex: '5 5', display: 'flex', flexDirection: 'column', paddingLeft: '10px' }}>
          <b>{device.deviceName}</b>
          <div>{device.deviceID}</div>
          <div>{device.serialNumber}</div>
          <div>{device.formerSensorNumber}</div>
          <div>{doorSensorID}</div>
          <div>{twilioNumber}</div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
          }}
        >
          <Button
            type="button"
            onClick={() => {
              deleteDevice(device)
            }}
            variant="outline-danger"
            size="sm"
          >
            Remove
            <br />
            Device
          </Button>
        </div>
      </div>
    </div>
  )
}

ActivatedDeviceDisplay.propTypes = {
  device: PropTypes.instanceOf(ActivatedDevice).isRequired,
  deleteDevice: PropTypes.func.isRequired,
}

export default ActivatedDeviceDisplay
