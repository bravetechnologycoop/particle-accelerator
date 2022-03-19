import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
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
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <MainSensorContent ref={componentRef} sensorNumber={sensorNumber} locationNumber={locationNumber} locationName={locationName} />
      <div>
        <Button type="button" onClick={handlePrint}>
          Print
        </Button>
      </div>
    </div>
  )
}

MainSensorLabel.propTypes = {
  sensorNumber: PropTypes.number.isRequired,
  locationName: PropTypes.string.isRequired,
  locationNumber: PropTypes.number.isRequired,
}

export default MainSensorLabel
