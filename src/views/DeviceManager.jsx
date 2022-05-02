import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'
import ActivatedDevice from '../utilities/ActivatedDevice'
import { getAllTasksInPATracker } from '../utilities/ClickupFunctions'
import ActivatedDeviceDisplay from '../components/DeviceManager/ActivatedDeviceDisplay'
import ClickupTasksView from '../components/DeviceManager/ClickupTasksView'
import SearchBar from '../components/DeviceManager/SearchBar'

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
  searchRow: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: '10px',
    alignItems: 'flex-end',
  },
}

function DeviceManager(props) {
  const { activatedDevices, changeActivatedDevices, clickupToken } = props

  const [clickupTasks, setClickupTasks] = useState([])
  const [clickupTaskLoadStatus, setClickupTaskLoadStatus] = useState('idle')
  const [initialized, setInitialized] = useState(false)

  const [searchValue, setSearchValue] = useState('')
  const [searchParam, setSearchParam] = useState('')
  const [filterMatches, setFilterMatches] = useState(true)

  function changeSearchValue(newValue) {
    setSearchValue(newValue)
  }

  function toggleFilterMatches() {
    if (filterMatches) {
      setFilterMatches(false)
    } else {
      setFilterMatches(true)
    }
  }

  useEffect(() => {
    // no top-level await workaround
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
      // only fetch once.
      setInitialized(true)
    }
  })

  /**
   * pushTaskToDevices: helper function to add a Clickup Task from the PA Tracker as an ActivatedDevice to the activatedDevices list.
   * @param {ClickupTask} existingTask  the clickup task to add to activatedDevices
   */
  function pushTaskToDevices(existingTask) {
    const newDeviceArray = [ActivatedDevice.FromClickupTask(existingTask)]
    const updatedList = newDeviceArray.concat(activatedDevices)
    changeActivatedDevices(updatedList)
  }

  /**
   * deleteDevice: removes a device from the activatedDevices list.
   * @param {ActivatedDevice} deviceToDelete
   */
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
        <Form>
          <div style={styles.searchRow}>
            <Form.Group>
              <Form.Label style={{ fontWeight: 'bold' }}>Filter by Property</Form.Label>
              <Form.Control
                as="select"
                value={searchParam}
                onChange={x => {
                  x.preventDefault()
                  setSearchParam(x.target.value)
                  setSearchValue('')
                }}
              >
                <option id="name" value="name" key="name">
                  Name
                </option>
                <option id="status" value="status" key="status">
                  Status
                </option>
                <option id="deviceID" value="deviceID" key="deviceID">
                  Device ID
                </option>
                <option id="serialNumber" value="serialNumber" key="serialNumber">
                  Serial Number
                </option>
                <option id="doorSensorID" value="doorSensorID" key="doorSensorID">
                  Door Sensor ID
                </option>
              </Form.Control>
            </Form.Group>
            <div style={{ paddingLeft: '10px' }}>
              <SearchBar searchValue={searchValue} changeSearchValue={changeSearchValue} searchParam={searchParam} />
            </div>
          </div>
          <Form.Check
            type="checkbox"
            id="default-checkbox"
            label="Filter Out Matching Tasks/Devices"
            checked={filterMatches}
            onChange={toggleFilterMatches}
            style={{ paddingTop: '10px' }}
          />
        </Form>
        <div style={styles.scrollableColumn}>
          <ClickupTasksView
            clickupTasks={clickupTasks}
            pushDevice={pushTaskToDevices}
            status={clickupTaskLoadStatus}
            activatedDevices={activatedDevices}
            filterMatches={filterMatches}
            searchParam={searchParam}
            searchValue={searchValue}
          />
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
