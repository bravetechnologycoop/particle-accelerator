import { Badge, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'
import ClickupTaskDisplay from './ClickupTaskDisplay'

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
}

export default ClickupTasksView
