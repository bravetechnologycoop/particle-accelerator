export default class ParticleSettings {
  /**
   * ParticleSettings: class to store configuration of a user's particle account
   * @param {string} userName                 The userName associated with the particle account
   * @param {string} productFirmwareVersion   the most current Brave firmware version associated with a selected product family (not used currently)
   * @param {string} deviceOSVersion          the most current Particle firmware version associated with a selected product family (not used currently)
   * @param {{}[]} productList              a list of all of the products associated with a particle account
   */
  constructor(userName, productFirmwareVersion, deviceOSVersion, productList) {
    this.userName = userName
    this.productFirmwareVersion = productFirmwareVersion
    this.deviceOSVersion = deviceOSVersion
    this.productList = productList
  }
}
