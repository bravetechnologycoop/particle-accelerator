import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table'
import { useCookies } from 'react-cookie'
import PropTypes from 'prop-types'
import checkIcon from '../graphics/check-circle-fill.svg'
import xIcon from '../graphics/x-circle-fill.svg'
import { Environments } from '../utilities/Constants'

export default function SystemStatus(props) {
  const { environment } = props
  const [sensorServerConnected, setSensorServerConnected] = useState(false)
  const [buttonServerConnected, setButtonServerConnected] = useState(false)
  const [sensorDatabaseConnected, setSensorDatabaseConnected] = useState(false)
  const [buttonsDatabaseConnected, setButtonsDatabaseConnected] = useState(false)
  const [cookies] = useCookies(['googleIdToken'])
  let braveApiKey = ''
  let sensorBaseUrl = ''
  let buttonsBaseUrl = ''

  if (environment === Environments.dev.name) {
    sensorBaseUrl = process.env.REACT_APP_SENSOR_DEV_URL
    buttonsBaseUrl = process.env.REACT_APP_BUTTONS_DEV_URL
    braveApiKey = process.env.REACT_APP_BRAVE_API_KEY_DEV
  } else if (environment === Environments.prod.name) {
    sensorBaseUrl = process.env.REACT_APP_SENSOR_PROD_URL
    buttonsBaseUrl = process.env.REACT_APP_BUTTONS_PROD_URL
    braveApiKey = process.env.REACT_APP_BRAVE_API_KEY_PROD
  } else if (environment === Environments.staging.name) {
    sensorBaseUrl = process.env.REACT_APP_SENSOR_STAGING_URL
    buttonsBaseUrl = process.env.REACT_APP_BUTTONS_STAGING_URL
    braveApiKey = process.env.REACT_APP_BRAVE_API_KEY_STAGING
  }

  async function getSensorServerStatus() {
    try {
      await axios({
        method: 'GET',
        url: `${sensorBaseUrl}/login`,
        headers: {
          'Cache-Control': 'no-store', // Disable caching so request has the most up-to-date status
        },
      })
      setSensorServerConnected(true)
    } catch (error) {
      setSensorServerConnected(false)
      console.log(error.message)
    }
  }

  async function getButtonsServerStatus() {
    try {
      await axios({
        method: 'GET',
        url: `${buttonsBaseUrl}/login`,
        headers: {
          'Cache-Control': 'no-store', // Disable caching so request has the most up-to-date status
        },
      })
      setButtonServerConnected(true)
    } catch (error) {
      setButtonServerConnected(false)
      console.log(error.message)
    }
  }

  async function getSensorDatabaseStatus() {
    try {
      await axios({
        method: 'POST',
        url: `${sensorBaseUrl}/pa/health`,
        headers: {
          'Cache-Control': 'no-store', // Disable caching so request has the most up-to-date status
        },
        data: {
          braveKey: braveApiKey,
          googleIdToken: cookies.googleIdToken,
        },
      })
      setSensorDatabaseConnected(true)
    } catch (error) {
      setSensorDatabaseConnected(false)
      console.log(error.message)
    }
  }

  async function getButtonsDatabaseStatus() {
    try {
      await axios({
        method: 'POST',
        url: `${buttonsBaseUrl}/pa/health`,
        headers: {
          'Cache-Control': 'no-store', // Disable caching so request has the most up-to-date status
        },
        data: {
          braveKey: braveApiKey,
          googleIdToken: cookies.googleIdToken,
        },
      })
      setButtonsDatabaseConnected(true)
    } catch (error) {
      setButtonsDatabaseConnected(false)
      console.log(error.message)
    }
  }

  useEffect(() => {
    getSensorServerStatus()
    getButtonsServerStatus()
    getSensorDatabaseStatus()
    getButtonsDatabaseStatus()
  }, [environment])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: 20 }}>
      <h2 className="mb-1">System Status</h2>
      <h5>
        <span className="badge rounded-pill bg-primary">For {environment.charAt(0).toUpperCase() + environment.slice(1)} Servers</span>
      </h5>
      <Table className="mt-2">
        <thead>
          <tr>
            <th>Device Type</th>
            <th>Server Status</th>
            <th>Database Connection Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Brave Sensors</td>
            <td>{sensorServerConnected ? <img src={checkIcon} alt="Green Check" /> : <img src={xIcon} alt="Red X" />}</td>
            <td>{sensorDatabaseConnected ? <img src={checkIcon} alt="Green Check" /> : <img src={xIcon} alt="Red X" />}</td>
          </tr>
          <tr>
            <td>Brave Buttons</td>
            <td>{buttonServerConnected ? <img src={checkIcon} alt="Green Check" /> : <img src={xIcon} alt="Red X" />}</td>
            <td>{buttonsDatabaseConnected ? <img src={checkIcon} alt="Green Check" /> : <img src={xIcon} alt="Red X" />}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}

SystemStatus.propTypes = { environment: PropTypes.string.isRequired }
