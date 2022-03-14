import ActivationAttempt from './ActivationAttempt'
import ActivatedDevice from './ActivatedDevice'

export function getParticleToken() {
  const result = sessionStorage.getItem('particleToken')

  if (result === null) {
    return ''
  }
  return result
}

export function changeParticleToken(newToken) {
  sessionStorage.setItem('particleToken', newToken)
}

export function changeParticleLoginState(newParticleLoginState) {
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

export function setClickupLoginState(newState) {
  sessionStorage.setItem('clickupLoginState', newState)
}

export function getClickupToken() {
  try {
    return sessionStorage.getItem('clickupToken')
  } catch (err) {
    return ''
  }
}

export function setClickupToken(newToken) {
  sessionStorage.setItem('clickupToken', newToken)
}

export function setActivationHistory(newHistory) {
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
      ),
  )
}

export function setActivatedDevices(newActivatedDeviceList) {
  const stringedData = JSON.stringify(newActivatedDeviceList)
  localStorage.setItem('activatedDevices', stringedData)
}

export function setSafeModeState(newState) {
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
