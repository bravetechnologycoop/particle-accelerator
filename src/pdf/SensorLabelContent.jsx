import React from 'react'
import PropTypes from 'prop-types'
import BraveLogo from './BraveLogo.svg'

const SensorLabelContent = React.forwardRef((props, ref) => {
  const { sensorNumber, locationID, labelType } = props

  const styles = {
    main: {
      height: '1.15in',
      width: '3in',
      fontFamily: 'Arial, Helvetica, sans-serif',
      display: 'flex',
      flexDirection: 'row',
    },
    logo: {
      flex: '0 0 1in',
      display: 'flex',
      justifyContent: 'center',
    },
    text: {
      flex: '0 0 2in',
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: '10px',
    },
    titleNumber: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  }

  return (
    <div ref={ref} style={styles.main}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      <link href="https://fonts.googleapis.com/css2?family=Spartan:wght@700&display=swap" rel="stylesheet" />
      <div style={styles.logo}>
        <img src={BraveLogo} alt="Brave Logo" style={{ width: '0.75in' }} />
      </div>
      <div style={styles.text}>
        <div style={styles.titleNumber}>
          <div style={{ fontSize: '22px', fontFamily: 'Spartan, Arial, sans-serif', paddingTop: '0.2in', letterSpacing: '-1px' }}>
            {labelType} Sensor
          </div>
          <div style={{ paddingRight: '30px', paddingTop: '10px', fontSize: '12px' }}>{sensorNumber}</div>
        </div>
        <div style={{ fontSize: '16px', fontFamily: 'Helvetica, sans-serif', paddingTop: '0px' }}>
          ID: <b>{locationID}</b>
        </div>
        <div style={{ fontSize: '11px', paddingTop: '0px' }}>clientsupport@brave.coop</div>
      </div>
    </div>
  )
})

SensorLabelContent.propTypes = {
  sensorNumber: PropTypes.string,
  locationID: PropTypes.string,
  labelType: PropTypes.string,
}

SensorLabelContent.defaultProps = {
  sensorNumber: 'w',
  locationID: '',
  labelType: '',
}

export default SensorLabelContent
