import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'
import SensorLabelContent from './SensorLabelContent'

function SensorLabel(props) {
  const { sensorNumber, locationID } = props

  const pageStyle = `
  @page {
    size: 58mm 84mm portrait;
  }
`

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle,
  })

  return (
    <Card>
      <Card.Header>Sensor Label</Card.Header>
      <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
        <div style={{ border: '1px solid grey', borderRadius: '10px' }}>
          <div ref={componentRef}>
            <SensorLabelContent sensorNumber={sensorNumber} locationID={locationID} labelType="Brave" />
            <SensorLabelContent sensorNumber={sensorNumber} locationID={locationID} labelType="Main" />
            <SensorLabelContent sensorNumber={sensorNumber} locationID={locationID} labelType="Door" />
          </div>
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

SensorLabel.propTypes = {
  sensorNumber: PropTypes.string,
  locationID: PropTypes.string,
}

SensorLabel.defaultProps = {
  sensorNumber: '',
  locationID: '',
}

export default SensorLabel
