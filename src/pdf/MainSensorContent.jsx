import React from 'react'
import PropTypes from 'prop-types'
import BraveLogo from './BraveLogo.svg'

const MainSensorContent = React.forwardRef((props, ref) => {
  const { sensorNumber, locationID } = props

  const styles = {
    main: {
      height: '1.2in',
      width: '2.4in',
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
      <link href="http://fonts.cdnfonts.com/css/league-spartan" rel="stylesheet" />
      <div style={styles.logo}>
        <img src={BraveLogo} alt="Brave Logo" style={{ width: '0.59in' }} />
      </div>
      <div style={styles.text}>
        <div style={styles.titleNumber}>
          <div style={{ fontSize: '15.5px', fontFamily: 'League Spartan, Arial, sans-serif', paddingTop: '0.1875in' }}>
            Main <br /> Sensor
          </div>
          <div style={{ padding: '20px', fontSize: '9.6px' }}>{sensorNumber}</div>
        </div>
        <div style={{ fontSize: '12px', fontFamily: 'Helvetica, sans-serif', paddingTop: '3px' }}>
          ID: <b>{locationID}</b>
        </div>
        <div style={{ fontSize: '8px', paddingTop: '5px' }}>clientsupport@brave.coop</div>
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
