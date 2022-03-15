export default class ActivatedDevice {
  constructor(deviceName, serialNumber, productID, deviceID, iccid, timeStamp, dateStamp, doorSensorID) {
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

    if (doorSensorID === null) {
      this.doorSensorID = 'null'
    } else {
      this.doorSensorID = doorSensorID
    }
  }
}
