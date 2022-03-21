import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import ActivatedDevice from '../utilities/ActivatedDevice'

function RenamerDeviceRow(props) {
  const { device, changeCurrentDevice, currentDevice } = props

  function clickHandler(event) {
    event.preventDefault()
    changeCurrentDevice(device)
  }

  const styles = {
    active: {
      border: '1px solid green',
    },
    inactive: {
      border: '1px solid grey',
    },
  }

  let style
  let buttonStyle
  let buttonText

  if (currentDevice === device) {
    style = styles.active
    buttonStyle = 'outline-success'
    buttonText = 'Selected'
  } else {
    style = styles.inactive
    buttonStyle = 'outline-primary'
    buttonText = 'Select'
  }

  return (
    <Card style={style}>
      <Card.Body>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div>
            <h5>{device.deviceName}</h5>
            {device.serialNumber}
          </div>
          <Button onClick={clickHandler} variant={buttonStyle} type="button">
            {buttonText}
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

RenamerDeviceRow.propTypes = {
  device: PropTypes.instanceOf(ActivatedDevice).isRequired,
  changeCurrentDevice: PropTypes.func,
  currentDevice: PropTypes.instanceOf(ActivatedDevice).isRequired,
}

RenamerDeviceRow.defaultProps = {
  changeCurrentDevice: () => {},
}

export default RenamerDeviceRow
