import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import ActivatedDevice from '../utilities/ActivatedDevice'
import { getAllTasksInPATracker } from '../utilities/ClickupFunctions'
import ActivatedDeviceDisplay from '../components/DeviceManager/ActivatedDeviceDisplay'
import ClickupTasksView from '../components/DeviceManager/ClickupTasksView'

const styles = {
  parent: {
    flex: '1 1',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 'inherit',
    padding: 20,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1',
  },
  scrollableColumn: {
    flex: '1 1',
    overflowY: 'auto',
  },
}

function DeviceManager(props) {
  const { activatedDevices, changeActivatedDevices, clickupToken } = props

  const [clickupTasks, setClickupTasks] = useState([])
  const [clickupTaskLoadStatus, setClickupTaskLoadStatus] = useState('idle')
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    async function getTasks() {
      setClickupTaskLoadStatus('true')
      const tasks = await getAllTasksInPATracker(clickupToken)
      if (tasks.length !== 0) {
        setClickupTaskLoadStatus('success')
        setClickupTasks(tasks)
      } else {
        setClickupTaskLoadStatus('error')
      }
    }

    if (!initialized) {
      getTasks()
      setInitialized(true)
    }
  })

  function pushTaskToDevices(existingTask) {
    const newDeviceArray = [ActivatedDevice.FromClickupTask(existingTask)]
    const updatedList = newDeviceArray.concat(activatedDevices)
    changeActivatedDevices(updatedList)
  }

  function deleteDevice(deviceToDelete) {
    const modifiedDeviceList = activatedDevices.filter(device => {
      return !deviceToDelete.compareDevices(device)
    })
    changeActivatedDevices(modifiedDeviceList)
  }

  return (
    <div style={styles.parent}>
      <div style={styles.column}>
        <h3>Add a Device From ClickUp</h3>
        <div style={styles.scrollableColumn}>
          <ClickupTasksView clickupTasks={clickupTasks} pushDevice={pushTaskToDevices} status={clickupTaskLoadStatus} />
        </div>
      </div>
      <div style={styles.scrollableColumn}>
        <h3>Devices in Memory</h3>
        <div style={{ flex: '1 1', overflowY: 'auto' }}>
          {activatedDevices.map(device => {
            return <ActivatedDeviceDisplay deleteDevice={deleteDevice} device={device} key={device.clickupTaskID} />
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

export default DeviceManager
