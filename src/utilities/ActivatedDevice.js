import { getCurrentFirmwareVersion, getDeviceDetails, pairDoorSensor } from './ParticleFunctions'
import { getClickupTaskIDByName, modifyClickupTaskCustomFieldValue } from './ClickupFunctions'

/**
 * ActivatedDevice
 *
 * Class for representing a successfully activated Particle Boron device.
 *
 * Fields:
 *
 *  - deviceName: Device name of the Boron
 *  - serialNumber: Boron serial number
 *  - productID: Particle product family ID assigned to the Boron
 *  - deviceID: device ID of the Boron
 *  - iccid: ICCID of the boron
 *  - timeStamp: timestamp of the boron's activation
 *  - dateStamp: datestamp of the boron's activation
 *  - doorSensorID: hex ID of the IM21 door sensor which is currently paired to the device
 *  - inPairingList: whether the device is currently in the process of being paired to a door sensor or not
 *  - intervalID: the setInterval ID of the device in pairing
 *  - clickupTaskID: the clickup Task ID of the device
 */
export default class ActivatedDevice {
  constructor(deviceName, serialNumber, productID, deviceID, iccid, timeStamp, dateStamp, doorSensorID, inPairingList, intervalID, clickupTaskID) {
    this.deviceName = deviceName
    this.serialNumber = serialNumber
    this.productID = productID
    this.deviceID = deviceID
    this.iccid = iccid

    if (timeStamp === null) {
      this.timeStamp = new Date().toLocaleTimeString()
    } else {
      this.timeStamp = timeStamp
    }

    if (dateStamp === null) {
      this.dateStamp = new Date().toLocaleTimeString()
    } else {
      this.dateStamp = dateStamp
    }

    this.doorSensorID = doorSensorID

    if (inPairingList === null) {
      this.inPairingList = false
    } else {
      this.inPairingList = inPairingList
    }

    this.intervalID = intervalID
    this.clickupTaskID = clickupTaskID
  }

  pairDoorSensor(particleToken, doorSensorID, interval, changeCheckState, reactStateHandler, clickupToken, clickupListID) {
    changeCheckState(this.deviceID, 'idle')
    reactStateHandler(this.deviceID, 'inPairingList', true)
    this.intervalID = setInterval(async () => {
      reactStateHandler(this.deviceID, 'inPairingList', true)
      console.log('interval')
      changeCheckState(this.deviceID, 'firmwareCheck')
      const targetFirmwareVersion = await getCurrentFirmwareVersion(this.productID, particleToken)
      const deviceDetails = await getDeviceDetails(this.serialNumber, this.productID, particleToken)
      if (deviceDetails.firmware_version === targetFirmwareVersion) {
        changeCheckState(this.deviceID, 'attemptingPairing')
        console.log('attempting to pair')
        const pairing = await pairDoorSensor(this.deviceID, doorSensorID, this.productID, particleToken)
        console.log('pairing request finished', pairing)
        if (pairing) {
          reactStateHandler(this.deviceID, 'inPairingList', false)
          reactStateHandler(this.deviceID, 'doorSensorID', doorSensorID)
          clearInterval(this.intervalID)
          const taskID = await getClickupTaskIDByName(clickupListID, this.deviceName, clickupToken)
          if (taskID !== null) {
            await modifyClickupTaskCustomFieldValue(taskID, process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_DOOR_SENSOR_ID, doorSensorID, clickupToken)
          }
        } else {
          changeCheckState(this.deviceID, 'idleNoPair')
        }
      } else {
        changeCheckState(this.deviceID, 'idleNoFirmware')
      }
    }, interval)
  }

  stopPairing(reactStateHandler) {
    console.log('interval id', this.intervalID)
    clearInterval(this.intervalID)
    reactStateHandler(this.deviceID, 'inPairingList', false)
  }

  static blankDevice() {
    return new ActivatedDevice('', '', '', '', '', null, null, '', false, '', '')
  }
}
