import ActivatedDevice from './ActivatedDevice'
import { getCurrentFirmwareVersion, getDeviceDetails, getDeviceInfo } from './ParticleFunctions'

export default class DoorSensorDevice extends ActivatedDevice {
  constructor(device, token) {
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
    this.token = token
  }

  startFirmwareChecks() {
    setInterval(async () => {
      const firmware = await getCurrentFirmwareVersion(this.productID, this.token)
      const deviceInfo = getDeviceDetails(this.serialNumber, this.productID, this.token)
    })
  }
}
