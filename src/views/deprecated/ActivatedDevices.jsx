import React from 'react'
import PropTypes from 'prop-types'
import { Card, Table } from 'react-bootstrap'
import ActivatedDevice from '../../utilities/ActivatedDevice'

function ActivatedDevices(props) {
  const { activatedDeviceList } = props

  if (activatedDeviceList.length === 0) {
    return (
      <>
        <h1>Activated Devices</h1>
        <hr />
        <h3>No Successfully Activated Devices</h3>
      </>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <h1>Activated Devices</h1>
      <hr />
      <div style={{ overflow: 'auto', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {activatedDeviceList.map(device => {
          return (
            <li
              key={`${device.timeStamp}${device.dateStamp}`}
              style={{ listStyle: 'none', paddingTop: '0.3em', paddingBottom: '0.3em', flex: '0 1 30ch' }}
            >
              <DeviceRow device={device} />
            </li>
          )
        })}
      </div>
    </div>
  )
}

ActivatedDevices.propTypes = {
  activatedDeviceList: PropTypes.arrayOf(PropTypes.instanceOf(ActivatedDevice)).isRequired,
}

function DeviceRow(props) {
  const { device } = props

  return (
    <Card key={`${device.timeStamp}${device.dateStamp}`}>
      <Card.Body>
        <h3 style={{ paddingBottom: '0.3em' }}>{device.deviceName}</h3>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Serial Number</td>
              <td>{device.serialNumber}</td>
            </tr>
            <tr>
              <td>Product</td>
              <td>{device.productID}</td>
            </tr>
            <tr>
              <td>Device ID</td>
              <td>{device.deviceID}</td>
            </tr>
            <tr>
              <td>Activation Date</td>
              <td>{device.dateStamp}</td>
            </tr>
            <tr>
              <td>Activation Time</td>
              <td>{device.timeStamp}</td>
            </tr>
            <tr>
              <td>Clickup Task ID</td>
              <td>{device.clickupTaskID}</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

DeviceRow.propTypes = {
  device: PropTypes.instanceOf(ActivatedDevice).isRequired,
}

export default ActivatedDevices
