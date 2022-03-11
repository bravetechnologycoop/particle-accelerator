import React from 'react'
import { Card, Table } from 'react-bootstrap'
import PropTypes from 'prop-types'
import ActivationAttempt from '../utilities/ActivationAttempt'
import StatusBadge from './StatusBadge'

function ActivationRow(props) {
  const { attempt } = props

  return (
    <Card key={`${attempt.timeStamp}${attempt.dateStamp}`}>
      <Card.Header>
        Activation Status: <StatusBadge status={attempt.totalStatus} />
      </Card.Header>
      <Card.Body>
        <h3 style={{ paddingBottom: '0.3em' }}>{attempt.deviceName}</h3>
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
              <td>{attempt.serialNumber}</td>
            </tr>
            <tr>
              <td>Product</td>
              <td>{attempt.productID}</td>
            </tr>
            <tr>
              <td>SIM Registration Country</td>
              <td>{attempt.country}</td>
            </tr>
            <tr>
              <td>Device ID</td>
              <td>{attempt.deviceID}</td>
            </tr>
            <tr>
              <td>SIM Activation Status</td>
              <td>
                <StatusBadge status={attempt.SIMActivationStatus} />
              </td>
            </tr>
            <tr>
              <td>Rename Status</td>
              <td>
                <StatusBadge status={attempt.namingStatus} />
              </td>
            </tr>
            <tr>
              <td>Attempt Date</td>
              <td>{attempt.dateStamp}</td>
            </tr>
            <tr>
              <td>Attempt Time</td>
              <td>{attempt.timeStamp}</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

ActivationRow.propTypes = {
  attempt: PropTypes.instanceOf(ActivationAttempt),
}

ActivationRow.defaultProps = {
  attempt: new ActivationAttempt(),
}

export default ActivationRow
