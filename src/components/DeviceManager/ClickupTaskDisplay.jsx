import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import React from 'react'
import ClickupTask from '../../utilities/ClickupTask'

function uppercase(text) {
  return text.replace(/(^\w)|(\s+\w)/g, letter => letter.toUpperCase())
}

function ClickupTaskDisplay(props) {
  const { task, pushDevice } = props

  let twilioNumber
  let doorSensorID

  if (task.doorSensorID === '') {
    doorSensorID = 'No Door Sensor ID'
  } else {
    doorSensorID = task.doorSensorID
  }

  if (task.twilioNumber === '') {
    twilioNumber = 'No Twilio Number'
  } else {
    twilioNumber = task.twilioNumber
  }

  return (
    <div style={{ padding: '10px', maxWidth: '500px' }}>
      <div
        style={{
          borderRadius: '5px',
          width: '100%',
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
            backgroundColor: task.statusColour,
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
          {uppercase(task.status)}
        </div>
        <div style={{ flex: '5 5', display: 'flex', flexDirection: 'column', paddingLeft: '10px' }}>
          <b>{task.name}</b>
          <div>{task.deviceID}</div>
          <div>{task.serialNumber}</div>
          <div>{task.formerSensorName}</div>
          <div>{task.doorSensorID}</div>
          <div>{task.twilioNumber}</div>
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
              pushDevice(task)
            }}
            variant="outline-dark"
            size="sm"
          >
            Add
            <br />
            to
            <br />
            Devices
          </Button>
        </div>
      </div>
    </div>
  )
}

ClickupTaskDisplay.propTypes = {
  task: PropTypes.instanceOf(ClickupTask).isRequired,
  pushDevice: PropTypes.func.isRequired,
}

export default ClickupTaskDisplay
