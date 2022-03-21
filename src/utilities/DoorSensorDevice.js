import ActivatedDevice from './ActivatedDevice'

export default class DoorSensorDevice extends ActivatedDevice {
  constructor(device) {
    super(
      device.deviceName,
      device.serialNumber,
      device.productID,
      device.deviceID,
      device.iccid,
      device.timeStamp,
      device.dateStamp,
      device.doorSensorID,
    )
  }

  startFirmwareChecks() {

  }
}
