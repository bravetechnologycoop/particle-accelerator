/**
 * Product: class for defining Product objects retrieved from the Particle API
 * Abstraction for representing product families in a Particle account.
 * Details on the various platform IDs can be found at:
 * https://github.com/particle-iot/device-os/blob/develop/hal/shared/platforms.h
 */
export default class Product {
  /**
   * Product: class for defining Product objects retrieved from the Particle API
   * @param {string} name         the name of the product family
   * @param {string} id           the id of the product family
   * @param {string} platform_id  the platform_id of the product family (device type)
   */
  constructor(name, id, platform_id) {
    this.name = name
    this.id = id
    if (typeof platform_id === 'number') {
      switch (platform_id) {
        case 3:
          this.deviceType = 'GCC'
          break
        case 6:
          this.deviceType = 'Photon'
          break
        case 8:
          this.deviceType = 'P1'
          break
        case 10:
          this.deviceType = 'Electron'
          break
        case 12:
          this.deviceType = 'Argon'
          break
        case 13:
          this.deviceType = 'Boron'
          break
        case 22:
          this.deviceType = 'ASOM'
          break
        case 23:
          this.deviceType = 'BSOM'
          break
        case 25:
          this.deviceType = 'B5SOM'
          break
        case 26:
          this.deviceType = 'Tracker'
          break
        case 60000:
          this.deviceType = 'Newhal'
          break
        default:
          this.deviceType = 'Unknown'
          break
      }
    } else {
      this.deviceType = platform_id
    }
  }
}
