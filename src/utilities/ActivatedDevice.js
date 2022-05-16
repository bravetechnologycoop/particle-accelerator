import { getCurrentFirmwareVersion, getDeviceDetails, pairDoorSensor } from './ParticleFunctions'
import { modifyClickupTaskCustomFieldValue, modifyClickupTaskStatus } from './ClickupFunctions'
import { ClickupStatuses, Environments } from './Constants'

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

  /**
   * **pairDoorSensor**: employs Particle cloud functions to pair an IM21 door sensor to a production boron device.
   * @param {string} particleToken            particle auth token
   * @param {string} doorSensorID             IM21 door sensor BLE ID, formatted a1,b2,c3
   * @param {number} interval                 interval in ms for retries if the pairing is unsuccessful.
   * @param {function} changePairingState     handler function for modifying the pairing state hook.
   * @param {function} modifyActivatedDevice  handler function for modifying the fields on an ActivatedDevice.
   * @param {string} clickupToken             clickup auth token
   */
  pairDoorSensor(particleToken, doorSensorID, interval, changePairingState, modifyActivatedDevice, clickupToken) {
    // Change the current pairing state to idle
    changePairingState(this.clickupTaskID, 'idle')

    // Change the device's state to be 'in the list of devices undergoing pairing'

    modifyActivatedDevice(this.clickupTaskID, { inPairingList: true })
    // Creates a setInterval for repeated pairing attempts
    this.intervalID = setInterval(async () => {
      // Reaffirm that the device is in the pairing list.
      modifyActivatedDevice(this.clickupTaskID, { inPairingList: true })

      // Indicate to user that the device is undergoing a firmware check
      changePairingState(this.clickupTaskID, 'firmwareCheck')

      // Retrieve the current firmware version from Particle (could be memoized in a future project)
      const targetFirmwareVersion = await getCurrentFirmwareVersion(this.productID, particleToken)

      // Retrieve device details from Particle.
      const deviceDetails = await getDeviceDetails(this.serialNumber, this.productID, particleToken)
      // Check that the device holds the most current firmware version
      if (deviceDetails.firmware_version === targetFirmwareVersion) {
        // Indicate to user that the device is attempting to pair
        changePairingState(this.clickupTaskID, 'attemptingPairing')
        // Attempt to pair door sensor using Particle cloud functions.
        const pairing = await pairDoorSensor(this.deviceID, doorSensorID, this.productID, particleToken)
        // If pairing is successful, change properties of the activatedDevice to advance clickupStatus
        if (pairing) {
          // Declare a modifyActivatedDevice 'dictionary'
          const modifyDeviceValues = {}
          // Stop the retry interval
          clearInterval(this.intervalID)
          // modify the doorSensorID clickup custom field
          const fieldModification = await modifyClickupTaskCustomFieldValue(
            this.clickupTaskID,
            process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_DOOR_SENSOR_ID,
            doorSensorID,
            clickupToken,
          )
          // change activated device field if successful
          if (fieldModification) {
            modifyDeviceValues.doorSensorID = doorSensorID
          }
          // modify clickup task status
          const statusModification = await modifyClickupTaskStatus(this.clickupTaskID, ClickupStatuses.pairedDoorSensor.name, clickupToken)
          // change activated device field if successful
          if (statusModification) {
            modifyDeviceValues.clickupStatus = ClickupStatuses.pairedDoorSensor.name
            modifyDeviceValues.clickupStatusColour = ClickupStatuses.pairedDoorSensor.color
          }
          modifyActivatedDevice(this.clickupTaskID, modifyDeviceValues)
        } else {
          // Tell the user that the device pairing failed due to pairing issues
          changePairingState(this.clickupTaskID, 'idleNoPair')
        }
      } else {
        // Tell the user that the device pairing failed due to incorrect firmware.
        changePairingState(this.clickupTaskID, 'idleNoFirmware')
      }
    }, interval)
  }

  /**
   * Stops pairing the device.
   * @param modifyActivatedDevice
   */
  stopPairing(modifyActivatedDevice) {
    clearInterval(this.intervalID)
    modifyActivatedDevice(this.clickupTaskID, { inPairingList: false })
  }

  /**
   * Creates a blank activated device.
   * @return {ActivatedDevice}
   */
  static BlankDevice() {
    return new ActivatedDevice('', '', '', '', '', null, null, '', false, '', '', '', '', '', '')
  }

  /**
   * Creates a new activated device from the initial activation part of the development process.
   * @param deviceName
   * @param serialNumber
   * @param productID
   * @param deviceID
   * @param iccid
   * @param clickupTaskID
   * @return {ActivatedDevice}
   */
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

  /**
   * Creates a new activated device from a ClickupTask
   * @param {ClickupTask} task
   * @return {ActivatedDevice}
   */
  static FromClickupTask(task, environment) {
    let particleProductId = process.env.REACT_APP_PARTICLE_SENSOR_PRODUCT_ID_DEV
    if (environment === Environments.staging.name) {
      particleProductId = process.env.REACT_APP_PARTICLE_SENSOR_PRODUCT_ID_STAGING
    } else if (environment === Environments.prod.name) {
      particleProductId = process.env.REACT_APP_PARTICLE_SENSOR_PRODUCT_ID_PROD
    }
    return new ActivatedDevice(
      task.name,
      task.serialNumber,
      particleProductId,
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

  /**
   * Creates a new activated device from an object. Usually used from localStorage.
   * @param object
   * @return {ActivatedDevice}
   * @constructor
   */
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

  /**
   * Value equality comparison for ActivatedDevices
   * @param {ActivatedDevice} other
   * @return {boolean} true if referential equality is present, false if not.
   */
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

  /**
   * Same as compareDevices, but without time or date stamps, or intervalIDs.
   * @param other
   * @return {boolean}
   */
  compareDevicesFromClickup(other) {
    return (
      this.deviceName === other.deviceName &&
      this.serialNumber === other.serialNumber &&
      this.productID === other.productID &&
      this.iccid === other.iccid &&
      this.doorSensorID === other.doorSensorID &&
      this.clickupTaskID === other.clickupTaskID &&
      this.clickupStatus === other.clickupStatus &&
      this.clickupStatusColour === other.clickupStatusColour &&
      this.twilioNumber === other.twilioNumber &&
      this.formerSensorNumber === other.formerSensorNumber
    )
  }
}
