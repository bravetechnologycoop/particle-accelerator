export default class DoorSensorDevice {
  constructor(device, doorSensorID) {
    this.deviceName = device.deviceName
    this.serialNumber = device.serialNumber
    this.productID = device.productID
    this.deviceID = device.deviceID
    this.iccid = device.iccid
    this.activationTimeStamp = device.timeStamp
    this.activationDateStamp = device.dateStamp
    this.doorSensorID = doorSensorID
  }


}
