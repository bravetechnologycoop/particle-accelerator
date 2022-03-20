import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import ActivatedDevice from '../utilities/ActivatedDevice'

function RenamerDeviceRow(props) {
  const { device, changeCurrentDevice } = props

  return (
    <Card onClick={changeCurrentDevice(device)}>
      <Card.Body>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div>
            <h5>{device.deviceName}</h5>
            {device.serialNumber}
          </div>
          <Button onClick={changeCurrentDevice} variant="outline-primary" type="button">
            Select
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

RenamerDeviceRow.propTypes = {
  device: PropTypes.instanceOf(ActivatedDevice).isRequired,
  changeCurrentDevice: PropTypes.func,
}

RenamerDeviceRow.defaultProps = {
  changeCurrentDevice: () => {},
}

export default RenamerDeviceRow
