import React from 'react'
import PropTypes from 'prop-types'
import BraveLogo from './BraveLogo.svg'

const MainSensorContent = React.forwardRef((props, ref) => {
  const { sensorNumber, locationID } = props

  const styles = {
    main: {
      height: '1.199in',
      width: '2.399in',
      fontFamily: 'Arial, Helvetica, sans-serif',
      display: 'flex',
      flexDirection: 'row',
    },
    logo: {
      flex: '0 0 0.8125in',
      display: 'flex',
      justifyContent: 'center',
    },
    text: {
      flex: '0 0 1.7125in',
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
        <img src={BraveLogo} alt="Brave Logo" style={{ width: '0.59in' }} />
      </div>
      <div style={styles.text}>
        <div style={styles.titleNumber}>
          <div style={{ fontSize: '22px', fontFamily: 'Spartan, Arial, sans-serif', paddingTop: '0.08in', letterSpacing: '-1px' }}>
            Main <br style={{ display: 'block', marginBottom: '0px' }} /> Sensor
          </div>
          <div style={{ paddingRight: '20px', paddingTop: '10px', fontSize: '12px' }}>{sensorNumber}</div>
        </div>
        <div style={{ fontSize: '16px', fontFamily: 'Helvetica, sans-serif', paddingTop: '0px' }}>
          ID: <b>{locationID}</b>
        </div>
        <div style={{ fontSize: '11px', paddingTop: '0px' }}>clientsupport@brave.coop</div>
      </div>
    </div>
  )
})

MainSensorContent.propTypes = {
  sensorNumber: PropTypes.string,
  locationID: PropTypes.string,
}

MainSensorContent.defaultProps = {
  sensorNumber: 'w',
  locationID: '',
}

export default MainSensorContent
