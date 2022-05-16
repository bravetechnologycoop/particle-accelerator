import { Badge, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'
import ClickupTaskDisplay from './ClickupTaskDisplay'
import ActivatedDevice from '../../utilities/ActivatedDevice'

function ClickupTasksView(props) {
  const { clickupTasks, status, pushDevice, filterMatches, searchValue, searchParam, activatedDevices, environment } = props

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
  if (status === 'empty') {
    return (
      <h3>
        <Badge bg="info">No Devices in Clickup</Badge>
      </h3>
    )
  }
  if (status === 'success') {
    if (filterMatches && searchValue !== '') {
      return (
        <>
          {clickupTasks
            .filter(task => {
              const taskAsDevice = ActivatedDevice.FromClickupTask(task, environment)
              if (activatedDevices.length === 0) {
                return true
              }
              const matchingDevices = activatedDevices.filter(device => {
                return !device.compareDevicesFromClickup(taskAsDevice)
              })
              return matchingDevices.length === 1
            })
            .filter(task => {
              return task[searchParam].toUpperCase().includes(searchValue.toUpperCase())
            })
            .map(task => {
              return <ClickupTaskDisplay task={task} pushDevice={pushDevice} key={task.id} />
            })}
        </>
      )
    }
    if (filterMatches) {
      return (
        <>
          {clickupTasks
            .filter(task => {
              const taskAsDevice = ActivatedDevice.FromClickupTask(task, environment)
              if (activatedDevices.length === 0) {
                return true
              }
              const matchingDevices = activatedDevices.filter(device => {
                return !device.compareDevicesFromClickup(taskAsDevice)
              })
              return matchingDevices.length === 1
            })
            .map(task => {
              return <ClickupTaskDisplay task={task} pushDevice={pushDevice} key={task.id} />
            })}
        </>
      )
    }
    if (searchValue !== '') {
      return (
        <>
          {clickupTasks
            .filter(task => {
              return task[searchParam].toUpperCase().includes(searchValue.toUpperCase())
            })
            .map(task => {
              return <ClickupTaskDisplay task={task} pushDevice={pushDevice} key={task.id} />
            })}
        </>
      )
    }
    return (
      <>
        {clickupTasks.map(task => {
          return <ClickupTaskDisplay task={task} pushDevice={pushDevice} key={task.id} />
        })}
      </>
    )
  }
}

ClickupTasksView.propTypes = {
  // Could make ClickupTask class
  // eslint-disable-next-line react/forbid-prop-types
  clickupTasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  status: PropTypes.string.isRequired,
  pushDevice: PropTypes.func.isRequired,
  filterMatches: PropTypes.bool,
  searchValue: PropTypes.string,
  searchParam: PropTypes.string,
  activatedDevices: PropTypes.arrayOf(PropTypes.instanceOf(ActivatedDevice)),
  environment: PropTypes.string.isRequired,
}

ClickupTasksView.defaultProps = {
  filterMatches: false,
  searchValue: '',
  searchParam: '',
  activatedDevices: [],
}

export default ClickupTasksView
