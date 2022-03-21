import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'
import DoorSensorContent from './DoorSensorContent'

function DoorSensorLabel(props) {
  const { sensorNumber, locationID } = props

  const pageStyle = `
  @page {
    size: 60.96mm 30.48mm;
  }
`

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle,
  })

  return (
    <Card>
      <Card.Header>Door Sensor Label</Card.Header>
      <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
        <div style={{ border: '1px solid grey', borderRadius: '10px' }}>
          <DoorSensorContent ref={componentRef} sensorNumber={sensorNumber} locationID={locationID} />
        </div>
        <div style={{ paddingTop: '10px' }}>
          <Button type="button" variant="outline-secondary" onClick={handlePrint}>
            Print
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

DoorSensorLabel.propTypes = {
  sensorNumber: PropTypes.string,
  locationID: PropTypes.string,
}

DoorSensorLabel.defaultProps = {
  sensorNumber: '',
  locationID: '',
}

export default DoorSensorLabel
