// Third-party dependencies
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import BootstrapTable from 'react-bootstrap-table-next'
import { Alert } from 'react-bootstrap'

// In-house dependencies
import SpinnerWithTimeEstimate from '../components/general/SpinnerWithTimeEstimate'

const { getAllSensors } = require('../utilities/DatabaseFunctions')

export default function Dashboard(props) {
  // eslint-disable-next-line no-unused-vars
  const { clickupToken, environment } = props

  const navigate = useNavigate()

  const [loadStatus, setLoadStatus] = useState('idle') // Controls loading spinner and error display
  const [initialized, setInitialized] = useState(false) // Ensures data is only loaded once
  const [sensors, setSensors] = useState([])

  const columns = [
    {
      dataField: 'client.displayName',
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
    onClick: (e, row) => {
      navigate(`/dashboard/clients/${row.clientId}/sensors/${row.locationid}/edit`)
    },
  }

  const styles = {
    scrollView: {
      overflow: 'auto',
      paddingRight: '10px',
      paddingLeft: '10px',
      paddingBottom: '10px',
    },
    rowStyles: {
      cursor: 'pointer',
    },
  }

  // Load the initial values from backend
  useEffect(() => {
    // no top-level await workaround
    async function load() {
      setLoadStatus('waiting')

      const allSensors = await getAllSensors(environment)

      if (allSensors === null) {
        setLoadStatus('error')
      } else if (allSensors.length !== 0) {
        setLoadStatus('success')
        setSensors(allSensors)
      } else {
        setLoadStatus('empty')
      }
    }

    if (!initialized) {
      load()

      // only load once
      setInitialized(true)
    }
  })

  return (
    <div style={styles.scrollView}>
      <h1>Buttons Dashboard</h1>
      <p>Go to:</p>
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
      <h1>Sensors Dashboard</h1>
      <p>Go to:</p>
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

      <h1>Sensors</h1>

      {(loadStatus === 'waiting' || loadStatus === 'idle') && <SpinnerWithTimeEstimate timeEstimate={1} timeEstimateUnits="second" />}

      {loadStatus === 'empty' && <h2>No Sensors</h2>}

      {loadStatus === 'error' && <Alert variant="danger">Error feteching Sensors</Alert>}

      {loadStatus === 'success' && (
        <BootstrapTable keyField="locationid" data={sensors} columns={columns} rowEvents={rowEvents} rowStyle={styles.rowStyles} striped />
      )}
    </div>
  )
}

Dashboard.propTypes = {
  clickupToken: PropTypes.string.isRequired,
  environment: PropTypes.string.isRequired,
}
