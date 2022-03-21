import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import ActivatedDevice from '../utilities/ActivatedDevice'
import { getActivatedDevices } from '../utilities/StorageFunctions'
import DeviceRow from '../components/DeviceRow'

function ActivatedDevices(props) {
  const { activatedDeviceList, changeActivatedDeviceList } = props

  useEffect(() => {
    changeActivatedDeviceList(getActivatedDevices())
  })

  if (activatedDeviceList.length === 0) {
    return (
      <>
        <h1>Activated Devices</h1>
        <hr />
        <h3>No Successfully Activated Devices</h3>
      </>
    )
  }

  return (
    <>
      <h1>Activated Devices</h1>
      <hr />
      {activatedDeviceList.map(device => {
        return (
          <li key={`${device.timeStamp}${device.dateStamp}`} style={{ listStyle: 'none', paddingTop: '0.3em', paddingBottom: '0.3em' }}>
            <DeviceRow device={device} />
          </li>
        )
      })}
    </>
  )
}

ActivatedDevices.propTypes = {
  activatedDeviceList: PropTypes.arrayOf(PropTypes.instanceOf(ActivatedDevice)),
  changeActivatedDeviceList: PropTypes.func,
}

ActivatedDevices.defaultProps = {
  activatedDeviceList: [new ActivatedDevice()],
  changeActivatedDeviceList: () => {},
}

export default ActivatedDevices
