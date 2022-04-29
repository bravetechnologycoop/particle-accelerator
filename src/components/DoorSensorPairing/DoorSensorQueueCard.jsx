import { Card } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import React from 'react'
import ActivatedDevice from '../../utilities/ActivatedDevice'
import QueueStatusBadge from './QueueStatusBadge'

function DoorSensorQueueCard(props) {
  const { device, status, reactStateHandler } = props
  if (status === 'paired') {
    return (
      <Card key={`${device.dateStamp}${device.timeStamp}`}>
        <Card.Body>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <h5 style={{ paddingRight: '10px' }}>{device.deviceName}</h5>
            <QueueStatusBadge status={status} />
          </div>
          {device.doorSensorID}
        </Card.Body>
      </Card>
    )
  }
  return (
    <Card key={`${device.dateStamp}${device.timeStamp}`}>
      <Card.Body>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <h5 style={{ paddingRight: '10px' }}>{device.deviceName}</h5>
          <QueueStatusBadge status={status} />
        </div>
        <Button
          onClick={() => device.stopPairing(reactStateHandler)}
          type="button"
          variant="danger"
          style={{ fontSize: 'small', paddingTop: '10px' }}
        >
          Stop Pairing
        </Button>
      </Card.Body>
    </Card>
  )
}

DoorSensorQueueCard.propTypes = {
  device: PropTypes.instanceOf(ActivatedDevice).isRequired,
  status: PropTypes.string.isRequired,
  reactStateHandler: PropTypes.func,
}

DoorSensorQueueCard.defaultProps = {
  reactStateHandler: () => {},
}

export default DoorSensorQueueCard
