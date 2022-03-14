import React from 'react'
import { Card, Table } from 'react-bootstrap'
import PropTypes from 'prop-types'
import ActivatedDevice from '../utilities/ActivatedDevice'

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
              <td>Attempt Date</td>
              <td>{device.dateStamp}</td>
            </tr>
            <tr>
              <td>Attempt Time</td>
              <td>{device.timeStamp}</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

DeviceRow.propTypes = {
  device: PropTypes.instanceOf(ActivatedDevice),
}

DeviceRow.defaultProps = {
  device: new ActivatedDevice(),
}

export default DeviceRow
