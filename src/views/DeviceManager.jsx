import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Badge, Spinner } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import ActivatedDevice from '../utilities/ActivatedDevice'
import { getAllTasksInPATracker } from '../utilities/ClickupFunctions'
import ClickupTask from '../utilities/ClickupTask'

const styles = {
  parent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
}

function DeviceManager(props) {
  const { activatedDevices, changeActivatedDevices, clickupToken } = props

  const [clickupTasks, setClickupTasks] = useState([])
  const [clickupTaskLoadStatus, setClickupTaskLoadStatus] = useState('idle')
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    async function getTasks() {
      console.log('get tasks')
      setClickupTaskLoadStatus('true')
      const tasks = await getAllTasksInPATracker(clickupToken)
      if (tasks.length !== 0) {
        setClickupTaskLoadStatus('success')
        setClickupTasks(tasks)
      } else {
        setClickupTaskLoadStatus('error')
      }
    }

    console.log(initialized)
    if (!initialized) {
      getTasks()
      setInitialized(true)
    }
  })

  function pushDevice(newDevice) {
    const newDeviceArray = [newDevice]
    const updatedList = newDeviceArray.concat(activatedDevices)
    changeActivatedDevices(updatedList)
  }

  return (
    <div style={styles.parent}>
      <div style={styles.column}>
        <h3>Add a Device From ClickUp</h3>
        <div style={{ height: '75vh', overflowY: 'auto' }}>
          <ClickupTasksView clickupTasks={clickupTasks} pushDevice={pushDevice} status={clickupTaskLoadStatus} />
        </div>
      </div>
      <div style={styles.column}>
        <h3>Devices in Memory</h3>
        <div style={{ height: '98vh', overflowY: 'auto' }}>
          {activatedDevices.map(device => {
            return <ActivatedDeviceDisplay deleteDevice={() => {}} device={device} />
          })}
        </div>
      </div>
    </div>
  )
}

DeviceManager.propTypes = {
  activatedDevices: PropTypes.arrayOf(PropTypes.instanceOf(ActivatedDevice)).isRequired,
  changeActivatedDevices: PropTypes.func.isRequired,
  clickupToken: PropTypes.string.isRequired,
}

function ClickupTasksView(props) {
  const { clickupTasks, status, pushDevice } = props

  if (status === 'idle') {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>
  }
  if (status === 'true') {
    return <Spinner animation="border" />
  }
  if (status === 'error') {
    return (
      <h3>
        <Badge bg="danger">Error in Fetching Clickup Tasks</Badge>
      </h3>
    )
  }
  if (status === 'success') {
    return (
      <>
        {clickupTasks.map(task => {
          return <ClickupTaskDisplay task={task} pushDevice={pushDevice} key={task.deviceID} />
        })}
      </>
    )
  }
}

ClickupTasksView.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  clickupTasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  status: PropTypes.string.isRequired,
  pushDevice: PropTypes.func.isRequired,
}

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
          <Button type="button" onClick={() => {}} variant="outline-dark" size="sm">
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

function ActivatedDeviceDisplay(props) {
  const { device, deleteDevice } = props

  let twilioNumber
  let doorSensorID

  if (device.doorSensorID === '') {
    doorSensorID = 'No Door Sensor ID'
  } else {
    doorSensorID = device.doorSensorID
  }

  if (device.twilioNumber === '') {
    twilioNumber = 'No Twilio Number'
  } else {
    twilioNumber = device.twilioNumber
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
            backgroundColor: device.statusColour,
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
          <div>{device.formerSensorName}</div>
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
          <Button type="button" onClick={() => {}} variant="outline-danger" size="sm">
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

export default DeviceManager
