import React from 'react'
import PropTypes from 'prop-types'
import ActivatedDevice from '../utilities/ActivatedDevice'
import DoorSensorEntryCard from '../components/DoorSensorEntryCard'

function DoorSensorView(props) {
  // eslint-disable-next-line no-unused-vars
  const { activatedDevices, changeActivatedDevices } = props

  const styles = {
    parent: {
      display: 'flex',
      flexDirection: 'row',
    },
    column: {
      flex: '1 1 33%',
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: '20px',
      paddingRight: '20px',
    },
    checkerBox: {
      flex: '1 1 25vh',
    },
    queueBox: {
      flex: '1 1 75vh',
    },
    scrollView: {
      overflowY: 'auto',
    },
  }

  return (
    <div style={styles.parent}>
      <div style={styles.column}>
        <div>
          <h3>Activated Devices</h3>
          <hr />
        </div>
        <div style={styles.scrollView}>
          {activatedDevices.map(device => {
            return (
              <div style={{ paddingTop: '0.1ch', paddingBottom: '0.2ch' }}>
                <DoorSensorEntryCard device={device} />
              </div>
            )
          })}
        </div>
      </div>
      <div style={styles.column}>
        <div style={styles.checkerBox}>
          <h3>Checking Firmware State</h3>
          <hr />
        </div>
        <div style={styles.queueBox}>
          <h3>Queue</h3>
          <hr />
        </div>
      </div>
      <div style={styles.column}>
        <div>
          <h3>Successful Pairings</h3>
          <hr />
        </div>
      </div>
    </div>
  )
}

DoorSensorView.propTypes = {
  activatedDevices: PropTypes.arrayOf(PropTypes.instanceOf(ActivatedDevice)),
  changeActivatedDevices: PropTypes.func,
}

DoorSensorView.defaultProps = {
  activatedDevices: new ActivatedDevice(),
  changeActivatedDevices: () => {},
}

export default DoorSensorView
