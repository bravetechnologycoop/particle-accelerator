import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table'
import { useCookies } from 'react-cookie'
import checkIcon from '../graphics/check-circle-fill.svg'
import xIcon from '../graphics/x-circle-fill.svg'

export default function SystemStatus() {
  const [sensorServerConnected, setSensorServerConnected] = useState(false)
  const [buttonServerConnected, setButtonServerConnected] = useState(false)
  const [sensorDatabaseConnected, setSensorDatabaseConnected] = useState(false)
  const [buttonsDatabaseConnected, setButtonsDatabaseConnected] = useState(false)
  const [cookies] = useCookies(['googleIdToken'])
  const braveApiKey = process.env.REACT_APP_BRAVE_API_KEY_PROD
  const sensorURL = process.env.REACT_APP_SENSOR_PROD_URL
  const buttonsURL = process.env.REACT_APP_BUTTONS_PROD_URL

  async function getSensorServerStatus() {
    try {
      await axios({
        method: 'GET',
        url: `${sensorURL}/login`,
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
        url: `${buttonsURL}/login`,
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
        url: `${process.env.REACT_APP_SENSOR_DEV_URL}/pa/health`, // CHANGE THIS TO PROD SENSOR ROUTE WHEN SENSOR PR COMPLETE
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
        url: `${process.env.REACT_APP_BUTTONS_DEV_URL}/pa/health`, // CHANGE THIS TO PROD SENSOR ROUTE WHEN SENSOR PR COMPLETE
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
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: 20 }}>
      <h3>System Status</h3>
      <Table>
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
