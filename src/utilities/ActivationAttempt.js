/**
 * ActivationAttempt: Class for creating ActivationAttempt objects which stores
 * the data of a device activation (of a Particle Boron)
 */
class ActivationAttempt {
  /**
   * ActivationAttempt: Class for creating ActivationAttempt objects which stores
   * the data of a device activation (of a Particle Boron)
   *
   * @param {string} serialNumber the serial number of the Particle Boron
   * @param {string} deviceName the device name of the Boron
   * @param {string} productID the product family id of the attempt
   * @param {string} deviceID the Particle deviceID of the Boron
   * @param {string} iccid the ICCID of the Boron
   * @param {string} country the country of the SIM activation
   * @param {string} SIMActivationStatus status of SIM activation
   * @param {string} namingStatus status of renaming on particle console
   * @param {string} totalStatus status of full registration
   * @param {string} timeStamp time of attempt
   * @param {string} dateStamp date of attempt
   */
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
