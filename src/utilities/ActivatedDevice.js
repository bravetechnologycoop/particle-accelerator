import { getCurrentFirmwareVersion, getDeviceDetails, pairDoorSensor } from './ParticleFunctions'
import { modifyClickupTaskCustomFieldValue, modifyClickupTaskStatus } from './ClickupFunctions'
import { ClickupStatuses } from './Constants'

/**
 * ActivatedDevice
 *
 * Class for representing a successfully activated Particle Boron device.
 */
export default class ActivatedDevice {
  constructor(
    deviceName,
    serialNumber,
    productID,
    deviceID,
    iccid,
    timeStamp,
    dateStamp,
    doorSensorID,
    inPairingList,
    intervalID,
    clickupTaskID,
    clickupStatus,
    clickupStatusColour,
    twilioNumber,
    formerSensorNumber,
  ) {
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
    this.clickupStatus = clickupStatus
    this.clickupStatusColour = clickupStatusColour
    this.twilioNumber = twilioNumber
    this.formerSensorNumber = formerSensorNumber
  }

  pairDoorSensor(particleToken, doorSensorID, interval, changeCheckState, reactStateHandler, clickupToken) {
    changeCheckState(this.clickupTaskID, 'idle')
    reactStateHandler(this.clickupTaskID, 'inPairingList', true)
    this.intervalID = setInterval(async () => {
      reactStateHandler(this.clickupTaskID, 'inPairingList', true)
      console.log('interval')
      changeCheckState(this.clickupTaskID, 'firmwareCheck')
      const targetFirmwareVersion = await getCurrentFirmwareVersion(this.productID, particleToken)
      console.log('target firmware version', targetFirmwareVersion)
      const deviceDetails = await getDeviceDetails(this.serialNumber, this.productID, particleToken)
      if (deviceDetails.firmware_version === targetFirmwareVersion) {
        changeCheckState(this.clickupTaskID, 'attemptingPairing')
        console.log('attempting to pair')
        const pairing = await pairDoorSensor(this.deviceID, doorSensorID, this.productID, particleToken)
        console.log('pairing request finished', pairing)
        if (pairing) {
          reactStateHandler(
            this.clickupTaskID,
            ['inPairingList', 'doorSensorID', 'clickupStatus', 'clickupStatusColour'],
            [false, doorSensorID, ClickupStatuses.pairedDoorSensor.name, ClickupStatuses.pairedDoorSensor.color],
          )
          clearInterval(this.intervalID)
          await modifyClickupTaskCustomFieldValue(
            this.clickupTaskID,
            process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_DOOR_SENSOR_ID,
            doorSensorID,
            clickupToken,
          )
          await modifyClickupTaskStatus(this.clickupTaskID, ClickupStatuses.pairedDoorSensor.name, clickupToken)
        } else {
          changeCheckState(this.clickupTaskID, 'idleNoPair')
        }
      } else {
        changeCheckState(this.clickupTaskID, 'idleNoFirmware')
      }
    }, interval)
  }

  stopPairing(reactStateHandler) {
    console.log('interval id', this.intervalID)
    clearInterval(this.intervalID)
    reactStateHandler(this.clickupTaskID, 'inPairingList', false)
  }

  static BlankDevice() {
    return new ActivatedDevice('', '', '', '', '', null, null, '', false, '', '', '', '', '', '')
  }

  static FromActivation(deviceName, serialNumber, productID, deviceID, iccid, clickupTaskID) {
    return new ActivatedDevice(
      deviceName,
      serialNumber,
      productID,
      deviceID,
      iccid,
      null,
      null,
      '',
      false,
      null,
      clickupTaskID,
      ClickupStatuses.activation.name,
      '#f9d900',
      '',
      deviceName,
    )
  }

  static FromClickupTask(task) {
    return new ActivatedDevice(
      task.name,
      task.serialNumber,
      process.env.REACT_APP_PARTICLE_SENSOR_PRODUCT_ID,
      task.deviceID,
      task.iccid,
      null,
      null,
      task.doorSensorID,
      false,
      '',
      task.id,
      task.status,
      task.statusColour,
      task.twilioNumber,
      task.formerSensorName,
    )
  }

  static FromObject(object) {
    return new ActivatedDevice(
      object.name,
      object.deviceID,
      object.productID,
      object.deviceID,
      object.iccid,
      object.timeStamp,
      object.dateStamp,
      object.doorSensorID,
      object.inPairingList,
      object.productID,
      object.id,
      object.status,
      object.clickupStatusColour,
      object.twilioNumber,
      object.formerSensorName,
    )
  }

  compareDevices(other) {
    return (
      this.deviceName === other.deviceName &&
      this.serialNumber === other.serialNumber &&
      this.productID === other.productID &&
      this.iccid === other.iccid &&
      this.timeStamp === other.timeStamp &&
      this.dateStamp === other.dateStamp &&
      this.doorSensorID === other.doorSensorID &&
      this.inPairingList === other.inPairingList &&
      this.intervalID === other.intervalID &&
      this.clickupTaskID === other.clickupTaskID &&
      this.clickupStatus === other.clickupStatus &&
      this.clickupStatusColour === other.clickupStatusColour &&
      this.twilioNumber === other.twilioNumber &&
      this.formerSensorNumber === other.formerSensorNumber
    )
  }
}
