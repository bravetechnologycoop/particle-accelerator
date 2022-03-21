import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'
import MainSensorContent from './MainSensorContent'

function MainSensorLabel(props) {
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
      <Card.Header>Main Sensor Label</Card.Header>
      <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
        <div style={{ border: '1px solid grey', borderRadius: '10px' }}>
          <MainSensorContent ref={componentRef} sensorNumber={sensorNumber} locationID={locationID} />
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
  sensorNumber: PropTypes.string,
  locationID: PropTypes.string,
}

MainSensorLabel.defaultProps = {
  sensorNumber: '',
  locationID: '',
}

export default MainSensorLabel
