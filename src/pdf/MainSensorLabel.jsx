import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'
import MainSensorContent from './MainSensorContent'

function MainSensorLabel(props) {
  const { sensorNumber, locationName, locationNumber } = props

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
      <Card.Header>Main Sensor Label</Card.Header>
      <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
        <div style={{ border: '1px solid grey', borderRadius: '10px' }}>
          <MainSensorContent ref={componentRef} sensorNumber={sensorNumber} locationNumber={locationNumber} locationName={locationName} />
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

MainSensorLabel.propTypes = {
  sensorNumber: PropTypes.number.isRequired,
  locationName: PropTypes.string.isRequired,
  locationNumber: PropTypes.number.isRequired,
}

export default MainSensorLabel
