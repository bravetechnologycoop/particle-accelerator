import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table'
import { useCookies } from 'react-cookie'
import checkIcon from '../graphics/check-circle-fill.svg'
import xIcon from '../graphics/x-circle-fill.svg'

export default function SystemStatus() {
  const [sensorServerUp, setSensorServerUp] = useState(false)
  const [buttonServerUp, setButtonServerUp] = useState(false)
  const [sensorDatabaseUp, setSensorDatabaseUp] = useState(false)
  // const [buttonsDatabaseUp, setButtonsDatabaseUp] = useState(false)
  const [cookies] = useCookies(['googleIdToken'])
  const braveApiKey = process.env.REACT_APP_BRAVE_API_KEY_PROD
  const sensorURL = process.env.REACT_APP_SENSOR_PROD_URL
  const buttonsURL = process.env.REACT_APP_BUTTONS_PROD_URL

  async function getSensorServerStatus() {
    try {
      const response = await axios.get(sensorURL)
      setSensorServerUp(true)
      console.log(`Sensor Server Status: ${response.status}`)
    } catch (error) {
      setSensorServerUp(false)
      console.log(error)
    }
  }

  async function getButtonServerStatus() {
    try {
      const response = await axios.get(buttonsURL)
      setButtonServerUp(true)
      console.log(`Button Server Status: ${response.status}`)
    } catch (error) {
      setButtonServerUp(false)
      console.log(error)
    }
  }

  async function getSensorDatabaseStatus() {
    try {
      const data = {
        braveKey: braveApiKey,
        googleIdToken: cookies.googleIdToken,
      }
      const response = await axios.post(`http://localhost:8000/pa/check-database-connection`, data)
      setSensorDatabaseUp(true)
      console.log(`Sensor Database Status: ${response.status}`)
    } catch (error) {
      setSensorDatabaseUp(false)
      console.log(`Sensor Database Status: ${error.message}`)
    }
  }

  useEffect(() => {
    getSensorServerStatus()
    getButtonServerStatus()
    getSensorDatabaseStatus()
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
            <td>{sensorServerUp ? <img src={checkIcon} alt="Green Check" /> : <img src={xIcon} alt="Red X" />}</td>
            <td>{sensorDatabaseUp ? <img src={checkIcon} alt="Green Check" /> : <img src={xIcon} alt="Red X" />}</td>
          </tr>
          <tr>
            <td>Brave Buttons</td>
            <td>{buttonServerUp ? <img src={checkIcon} alt="Green Check" /> : <img src={xIcon} alt="Red X" />}</td>
            <td>not done yet</td>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}
