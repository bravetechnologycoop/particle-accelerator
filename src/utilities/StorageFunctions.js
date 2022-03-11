import ActivationAttempt from './ActivationAttempt'

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
