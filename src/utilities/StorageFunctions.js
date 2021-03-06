import ActivationAttempt from './ActivationAttempt'
import ActivatedDevice from './ActivatedDevice'
import ParticleSettings from './ParticleSettings'
import Product from './Product'
import { Environments } from './Constants'

/*
Library of storage functions used for interacting with localStorage and sessionStorage in the browser.
Each function either gets/retrieves from the browser storage, or stores.
 */

export function getParticleToken() {
  const result = sessionStorage.getItem('particleToken')

  if (result === null) {
    return ''
  }
  return result
}

export function storeParticleToken(newToken) {
  sessionStorage.setItem('particleToken', newToken)
}

export function storeParticleLoginState(newParticleLoginState) {
  sessionStorage.setItem('particleLoginState', newParticleLoginState)
}

export function getParticleLoginState() {
  const result = sessionStorage.getItem('particleLoginState')

  if (result === null) {
    return 'false'
  }
  return result
}

export function getClickupLoginState() {
  try {
    return sessionStorage.getItem('clickupLoginState')
  } catch (err) {
    return ''
  }
}

export function storeClickupLoginState(newState) {
  sessionStorage.setItem('clickupLoginState', newState)
}

export function storeActivationHistory(newHistory) {
  const stringedData = JSON.stringify(newHistory)
  localStorage.setItem('activationHistory', stringedData)
}

export function getActivationHistory() {
  const stringedData = localStorage.getItem('activationHistory')
  if (stringedData === null) {
    return []
  }
  const parsedData = JSON.parse(stringedData)

  return parsedData.map(
    attempt =>
      new ActivationAttempt(
        attempt.serialNumber,
        attempt.deviceName,
        attempt.productID,
        attempt.deviceID,
        attempt.iccid,
        attempt.country,
        attempt.SIMActivationStatus,
        attempt.namingStatus,
        attempt.totalStatus,
        attempt.timeStamp,
        attempt.dateStamp,
      ),
  )
}

export function getActivatedDevices() {
  const stringedData = localStorage.getItem('activatedDevices')
  if (stringedData === null) {
    return []
  }
  const parsedData = JSON.parse(stringedData)

  return parsedData.map(
    device =>
      new ActivatedDevice(
        device.deviceName,
        device.serialNumber,
        device.productID,
        device.deviceID,
        device.iccid,
        device.timeStamp,
        device.dateStamp,
        device.doorSensorID,
        device.inPairingList,
        device.intervalID,
        device.clickupTaskID,
        device.clickupStatus,
        device.clickupStatusColour,
        device.twilioNumber,
        device.formerSensorNumber,
      ),
  )
}

export function storeActivatedDevices(newActivatedDeviceList) {
  const stringedData = JSON.stringify(newActivatedDeviceList)
  localStorage.setItem('activatedDevices', stringedData)
}

export function storeSafeModeState(newState) {
  const stringedData = JSON.stringify(newState)
  localStorage.setItem('safeMode', stringedData)
}

export function getSafeModeState() {
  const stringedData = localStorage.getItem('safeMode')
  const parsedData = JSON.parse(stringedData)
  if (parsedData === 'true') {
    return true
  }
  if (parsedData === 'false') {
    return false
  }
  if (parsedData === null) {
    return true
  }
  return parsedData
}

export function storeParticleSettings(newSettings) {
  const stringedData = JSON.stringify(newSettings)
  sessionStorage.setItem('particleSettings', stringedData)
}

export function getParticleSettings() {
  const stringedData = sessionStorage.getItem('particleSettings')
  if (stringedData === null) {
    return new ParticleSettings('', '', '', [])
  }
  const parsedData = JSON.parse(stringedData)
  const tempProductList = []
  if (parsedData.productList !== [])
    for (const product of parsedData.productList) {
      tempProductList.push(new Product(product.name, product.id, product.deviceType))
    }
  return new ParticleSettings(parsedData.userName, parsedData.productFirmwareVersion, parsedData.deviceOSVersion, tempProductList)
}

export function getClickupToken() {
  const result = sessionStorage.getItem('clickupToken')
  if (result === null) {
    return ''
  }
  return result
}

export function storeClickupToken(newToken) {
  sessionStorage.setItem('clickupToken', newToken)
}

export function storeClickupUserName(newUserName) {
  sessionStorage.setItem('clickupUserName', newUserName)
}

export function retClickupUserName() {
  const result = sessionStorage.getItem('clickupUserName')

  if (result === null) {
    return ''
  }
  return result
}

export function storeClickupListID(newListID) {
  sessionStorage.setItem('clickupListID', newListID)
}

export function retClickupListID() {
  const result = sessionStorage.getItem('clickupListID')

  if (result === null) {
    return ''
  }
  return result
}

export function storeClickupWorkspaces(workspaces) {
  const stringedData = JSON.stringify(workspaces)
  sessionStorage.setItem('clickupWorkspaces', stringedData)
}

export function retClickupWorkspaces() {
  const result = sessionStorage.getItem('clickupWorkspaces')
  if (result === null) {
    return []
  }
  return JSON.parse(result)
}

export function storeClickupSpaces(spaces) {
  const stringedData = JSON.stringify(spaces)
  sessionStorage.setItem('clickupSpaces', stringedData)
}

export function retClickupSpaces() {
  const result = sessionStorage.getItem('clickupSpaces')
  if (result === null) {
    return []
  }
  return JSON.parse(result)
}

export function storeClickupLists(lists) {
  const stringedData = JSON.stringify(lists)
  sessionStorage.setItem('clickupLists', stringedData)
}

export function retClickupLists() {
  const result = sessionStorage.getItem('clickupLists')
  if (result === null) {
    return []
  }
  return JSON.parse(result)
}

export function storeClickupWorkspaceID(workspaceID) {
  sessionStorage.setItem('clickupWorkspaceID', workspaceID)
}

export function retClickupWorkspaceID() {
  const result = sessionStorage.getItem('clickupWorkspaceID')
  if (result === null) {
    return ''
  }
  return result
}

export function storeClickupSpaceID(spaceID) {
  sessionStorage.setItem('clickupSpaceID', spaceID)
}

export function retClickupSpaceID() {
  const result = sessionStorage.getItem('clickupSpaceID')
  if (result === null) {
    return ''
  }
  return result
}

export function storeClickupListStatuses(statuses) {
  const stringedData = JSON.stringify(statuses)
  sessionStorage.setItem('clickupListStatuses', stringedData)
}

export function copyActivatedDevices(activatedDevices) {
  const stringedData = JSON.stringify(activatedDevices)
  if (stringedData === null) {
    return []
  }
  const parsedData = JSON.parse(stringedData)

  return parsedData.map(
    device =>
      new ActivatedDevice(
        device.deviceName,
        device.serialNumber,
        device.productID,
        device.deviceID,
        device.iccid,
        device.timeStamp,
        device.dateStamp,
        device.doorSensorID,
        device.inPairingList,
        device.intervalID,
        device.clickupTaskID,
        device.clickupStatus,
        device.clickupStatusColour,
        device.twilioNumber,
        device.formerSensorNumber,
      ),
  )
}

export function storeTwilioHistory(twilioHistory) {
  const stringedData = JSON.stringify(twilioHistory)
  localStorage.setItem('twilioHistory', stringedData)
}

export function retTwilioHistory() {
  const result = localStorage.getItem('twilioHistory')
  if (result === null) {
    return []
  }
  return JSON.parse(result)
}

export function storePairingList(newList) {
  const stringedData = JSON.stringify(newList)
  sessionStorage.setItem('pairingList', stringedData)
}

export function retPairingList() {
  const result = sessionStorage.getItem('pairingList')
  if (result === null) {
    return {}
  }
  return JSON.parse(result)
}

export function storeEnvironment(newEnv) {
  const stringedData = JSON.stringify(newEnv)
  localStorage.setItem('environment', stringedData)
}

export function retEnvironment() {
  const result = localStorage.getItem('environment')
  if (result === null) {
    return Environments.default.name
  }
  return JSON.parse(result)
}
