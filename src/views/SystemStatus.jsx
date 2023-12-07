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
      const response = await axios.get(`${sensorURL}/login`)
      setSensorServerConnected(true)
      console.log(`Sensor Server Status: ${response.status}`)
    } catch (error) {
      setSensorServerConnected(false)
      console.log(error)
    }
  }

  async function getButtonsServerStatus() {
    try {
      const response = await axios.get(`${buttonsURL}/login`)
      setButtonServerConnected(true)
      console.log(`Button Server Status: ${response.status}`)
    } catch (error) {
      setButtonServerConnected(false)
      console.log(error)
    }
  }

  async function getSensorDatabaseStatus() {
    try {
      const response = await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SENSOR_DEV_URL}/pa/get-sensor-clients`, // CHANGE THIS TO NEW SENSOR ROUTE WHEN COMPLETE
        headers: {},
        data: {
          braveKey: braveApiKey,
          googleIdToken: cookies.googleIdToken,
        },
      })
      setSensorDatabaseConnected(true)
      console.log(`Sensor Database Status: ${response.status}`)
    } catch (error) {
      setSensorDatabaseConnected(false)
      console.log(`Sensor Database Status: ${error.message}`)
    }
  }

  async function getButtonsDatabaseStatus() {
    try {
      const response = await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SENSOR_DEV_URL}/pa/get-sensor-clients`, // CHANGE THIS TO NEW BUTTON ROUTE WHEN COMPLETE
        headers: {},
        data: {
          braveKey: braveApiKey,
          googleIdToken: cookies.googleIdToken,
        },
      })
      setButtonsDatabaseConnected(true)
      console.log(`Sensor Database Status: ${response.status}`)
    } catch (error) {
      setButtonsDatabaseConnected(false)
      console.log(`Sensor Database Status: ${error.message}`)
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
