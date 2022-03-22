import ActivationAttempt from './ActivationAttempt'
import ActivatedDevice from './ActivatedDevice'
import ParticleSettings from './ParticleSettings'
import Product from './Product'

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
  const stringedData = JSON.stringify(newToken)
  sessionStorage.setItem('clickupToken', stringedData)
}

export function storeClickupUserName(newUserName) {
  const stringedData = JSON.stringify(newUserName)
  sessionStorage.setItem('clickupUserName', stringedData)
}

export function retClickupUserName() {
  const result = sessionStorage.getItem('clickupUserName')

  if (result === null) {
    return ''
  }
  return result
}

export function storeClickupListID(newListID) {
  const stringedData = JSON.stringify(newListID)
  sessionStorage.setItem('clickupListID', stringedData)
}

export function retClickupListID() {
  const result = sessionStorage.getItem('clickupListID')

  if (result === null) {
    return ''
  }
  return result
}
