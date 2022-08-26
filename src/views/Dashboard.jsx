import React from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import BootstrapTable from 'react-bootstrap-table-next'

export default function Dashboard(props) {
  // eslint-disable-next-line no-unused-vars
  const { clickupToken, environment } = props

  const navigate = useNavigate()

  const sensors = [
    { locationid: 'myid1', displayName: 'Sensor1', clientId: 'clientId1', clientDisplayName: 'client1' },
    { locationid: 'myid2', displayName: 'Sensor2', clientId: 'clientId2', clientDisplayName: 'client2' },
    { locationid: 'myid3', displayName: 'Sensor3', clientId: 'clientId1', clientDisplayName: 'client1' },
  ]
  const columns = [
    {
      dataField: 'clientDisplayName',
      text: 'Client',
      sort: true,
    },
    {
      dataField: 'displayName',
      text: 'Sensor',
      sort: true,
    },
    {
      dataField: 'locationid',
      text: 'locationid',
      sort: true,
    },
  ]

  const rowEvents = {
    onClick: (/* e, row, rowIndex */) => {
      navigate(`/device-lookup`)
    },
  }

  const styles = {
    container: {
      padding: 10,
    },
    rowStyles: {
      cursor: 'pointer',
    },
  }

  return (
    <div style={styles.container}>
      <h1>Buttons Dashboard</h1>
      <p>
        Go to:
        <ul>
          <li>
            <a href="https://chatbot.brave.coop" target="_blank" rel="noreferrer">
              Production Buttons Dashboard
            </a>
          </li>
          <li>
            <a href="https://chatbot-dev.brave.coop" target="_blank" rel="noreferrer">
              Dev Buttons Dashboard
            </a>
          </li>
        </ul>
      </p>
      <h1>Sensors Dashboard</h1>
      <p>
        Go to:
        <ul>
          <li>
            <a href="https://sensors.brave.coop" target="_blank" rel="noreferrer">
              Production Sensor Dashboard
            </a>
          </li>
          <li>
            <a href="https://staging.sensors.brave.coop" target="_blank" rel="noreferrer">
              Staging Sensor Dashboard
            </a>
          </li>
          <li>
            <a href="https://dev.sensors.brave.coop" target="_blank" rel="noreferrer">
              Dev Sensor Dashboard
            </a>
          </li>
        </ul>
      </p>
      <h1>Sensors</h1>
      <BootstrapTable keyField="id" data={sensors} columns={columns} rowEvents={rowEvents} rowStyle={styles.rowStyles} />
    </div>
  )
}

Dashboard.propTypes = {
  clickupToken: PropTypes.string.isRequired,
  environment: PropTypes.string.isRequired,
}
