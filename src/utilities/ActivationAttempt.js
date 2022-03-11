/**
 * ActivationAttempt: Class for creating ActivationAttempt objects which stores
 * the data of a device activation.
 */
class ActivationAttempt {
  constructor(serialNumber, deviceName, productID, deviceID, iccid, country, SIMActivationStatus, namingStatus, totalStatus, timeStamp, dateStamp) {
    this.serialNumber = serialNumber
    this.deviceName = deviceName
    this.deviceID = deviceID
    this.productID = productID
    this.iccid = iccid
    this.country = country
    this.SIMActivationStatus = SIMActivationStatus
    this.namingStatus = namingStatus
    this.totalStatus = totalStatus

    if (dateStamp === null) {
      this.dateStamp = new Date().toLocaleDateString()
    } else {
      this.dateStamp = dateStamp
    }

    if (timeStamp === null) {
      this.timeStamp = new Date().toLocaleTimeString()
    } else {
      this.timeStamp = timeStamp
    }
  }
}

export default ActivationAttempt
