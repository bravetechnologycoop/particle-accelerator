export default class ClickupTask {
  constructor(name, id, status, statusColour, deviceID, serialNumber, iccid, formerSensorName, doorSensorID, twilioNumber) {
    this.name = name
    this.id = id
    this.status = status
    this.statusColour = statusColour
    this.deviceID = deviceID
    this.serialNumber = serialNumber
    this.iccid = iccid
    this.formerSensorName = formerSensorName
    this.doorSensorID = doorSensorID
    this.twilioNumber = twilioNumber
  }
}
