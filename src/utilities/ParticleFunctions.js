/*
Library of functions which interact with the particle api to return/modify data.
 */

import Product from './Product'

const Particle = require('particle-api-js')

const particle = new Particle()

/**
 * login: attempts an asynchronous login to a user's Particle account.
 * @async
 * @param {string} username the user's username/email.
 * @param {string} password the user's respective password.
 * @param {string} otp the user's one time password (2FA) code.
 * @returns {Promise<string|null>} a token in the event of a successful login or null in the
 * event of an unsuccessful login (technically a promise)
 */
export async function login(username, password, otp) {
  let token
  try {
    const loginData = await particle.login({ username, password })
    token = loginData.body.access_token
  } catch (err) {
    let mfaToken
    try {
      mfaToken = err.error.response.body.mfa_token
    } catch (e) {
      console.error(`Error in acquiring token: ${err}`)
      return null
    }

    try {
      const otpData = await particle.sendOtp({ mfaToken, otp })
      token = otpData.body.access_token
    } catch (e2) {
      console.error(`Error in acquiring token: ${err}`)
      return null
    }
  }
  return token
}

/**
 * getDisplayName: Retrieves a user's name or company name based on a Particle
 * access token.
 * @async
 * @param {string} token Particle access token.
 * @returns {Promise<string>} user's name if successful on a personal account,
 * business's name if successful on a business account, error message if
 * unsuccessful.
 */
export async function getDisplayName(token) {
  try {
    const response = await particle.getUserInfo({ auth: token })

    if (response.body.account_info.business_account) {
      return response.body.account_info.company_name
    }
    const firstName = response.body.account_info.first_name
    const lastName = response.body.account_info.last_name
    return firstName.concat(' ', lastName)
  } catch (err) {
    console.error('Error in acquiring display name: ', err)
    return 'Error'
  }
}

/**
 * getProducts: retrieves a list of the current product families in a Particle
 * account based on the provided token.
 * @async
 * @param {string} token Particle access token.
 * @returns {Promise<*[]|null>} a list of the current products associated with the token
 * user account if successful, null if unsuccessful.
 */
export async function getProducts(token) {
  try {
    const response = await particle.listProducts({ auth: token })
    console.log(response)
    const rawProducts = response.body.products
    const productList = []
    // eslint-disable-next-line no-restricted-syntax
    for (const product of rawProducts) {
      productList.push(new Product(product.name, product.id, product.platform_id))
    }
    return productList
  } catch (err) {
    return null
  }
}

/**
 * addDeviceToProduct: Add a device to a product or move device out of quarantine.
 * @async
 * @param {string} deviceID  the device id of the target Particle device.
 * @param {string} product   the product family ID of the target Particle device.
 * @param {string} token Particle access token.
 */
export async function addDeviceToProduct(deviceId, product, token) {
  try {
    await particle.addDeviceToProduct({
      deviceId,
      product,
      auth: token,
    })
  } catch (err) {
    console.error(`Error in adding device '${deviceId}' to product '${product}'`, err)
  }
}

/**
 * getDeviceInfo: makes a GET request to the Particle server to get a device's
 * deviceID and ICCID.
 * @async
 * @param {string} serialNum The current device's serial number.
 * @param {string} token     Particle access token of the account to register to.
 * @returns {Promise<{deviceID: string, iccid: string}|string>} an Object containing the device's deviceID and iccid
 * (fields named respectively) if successful, 'Error' if unsuccessful.
 */
export async function getDeviceInfo(serialNum, token) {
  try {
    const deviceData = await particle.lookupSerialNumber({ serialNumber: serialNum, auth: token })
    // eslint-disable-next-line
    const { device_id } = deviceData.body
    const { iccid } = deviceData.body
    const deviceID = device_id
    return { deviceID, iccid }
  } catch (err) {
    console.error('Error in acquiring device information: ', err)
    return 'error'
  }
}

/**
 * activateDeviceSIM: activates the device's SIM and adds it to a user's
 * Particle device family.
 * @async
 * @param iccid   the ICCID of the current device
 * @param country the country to register the SIM in.
 * @param product the product family to add the device to.
 * @param token   a Particle access token for the destination account.
 * @returns {Promise<boolean>} true if successful, false if unsuccessful
 */
export async function activateDeviceSIM(iccid, country, product, token) {
  try {
    await particle.activateSIM({
      iccid,
      auth: token,
      country,
      product,
    })
    return true
  } catch (err) {
    console.error('error in sim activation: ', err)
    return false
  }
}

/**
 * changeDeviceName: change's a device's name on the Particle console.
 * @async
 * @param {string} deviceID  the device id of the target Particle device.
 * @param {string} product   the product family ID of the target Particle device.
 * @param {string} newName   the desired name for the target device.
 * @param {string} token     a Particle access token for the account that the target
 *                           device is registered to.
 * @returns {Promise<boolean>} true if the rename is successful, false if
 *                             unsuccessful.
 */
export async function changeDeviceName(deviceID, product, newName, token) {
  try {
    await particle.renameDevice({
      deviceId: deviceID,
      name: newName,
      auth: token,
      product,
    })
    return true
  } catch (err) {
    console.error('Error in device rename: ', err)
    return false
  }
}

/**
 * verifyDeviceRegistration: verifies that a device is registered to the desired
 * Particle account and has the correct: deviceID, name, product family, iccid,
 * and serial number.
 * @async
 * @param {string} deviceID      the hypothesised device id of the target device.
 * @param {string }name          the hypothesised name of the target device.
 * @param {string} product       the hypothesised Particle product family of the target
 *                               device.
 * @param {string} iccid         the hypothesised iccid of the target device.
 * @param {string} serialNumber  the hypothesised serial number of the target device.
 * @param {string} token         a Particle access token for the target device's
 *                               registration account.
 * @returns {Promise<boolean>} true if all of the conditions are met, false if
 *                             conditions fail or errors are returned.
 */
export async function verifyDeviceRegistration(deviceID, name, product, iccid, serialNumber, token) {
  try {
    const response = await particle.listDevices({
      auth: token,
      product,
      perPage: Number.MAX_SAFE_INTEGER,
    })
    const filtered = response.body.devices.filter(device => {
      return device.id === deviceID
    })
    if (filtered.length !== 1) {
      return false
    }
    const checkDevice = filtered.pop()
    return !(checkDevice.id !== deviceID || checkDevice.name !== name || checkDevice.iccid !== iccid || checkDevice.serial_number !== serialNumber)
  } catch (err) {
    console.error('Error in device verification: ', err)
    return false
  }
}

/**
 * getDeviceDetails: retrieves various details on a device from particle
 * @param {string} serialNumber     serial number of the device to lookup
 * @param {string} product          the ID of the particle product family to search for the device in
 * @param {string} token            particle auth token
 * @return {Promise<null|Object>}   an object containing data on the device if successful, null if not
 */
export async function getDeviceDetails(serialNumber, product, token) {
  try {
    const response = await particle.lookupSerialNumber({ serialNumber, auth: token })
    const deviceID = response.body.device_id
    const info = await particle.getDevice({ deviceId: deviceID, auth: token, product })
    return info.body
  } catch (err) {
    return null
  }
}

/**
 * searchDeviceByName: retrieves data on a particle device based on its name
 * @param {string} deviceName   the name of the device to search for
 * @param {string} token        particle auth token
 * @param {string} productID    the ID of the particle product family to search for the device in
 * @return {Promise<null|*>}    data on the device if successful, null if unsuccessful
 */
export async function searchDeviceByName(deviceName, token, productID) {
  try {
    const response = await particle.listDevices({ product: productID, auth: token, perPage: Number.MAX_SAFE_INTEGER })

    const list = response.body.devices

    const filteredList = list.filter(device => {
      return device.name === deviceName
    })

    if (filteredList.length !== 1) {
      return null
    }

    return filteredList[0]
  } catch (err) {
    console.error(err)
  }
}

/**
 * getCurrentFirmwareVersion: retrieves the current "product default" firmware version of a particle product family
 * @param {string} productID  the ID of the product family to find the current "product default" firmware version of
 * @param {string} token      particle auth token
 * @return {Promise<null|string>} the current "product default" firmware version of the product family if successful, null if not.
 */
export async function getCurrentFirmwareVersion(productID, token) {
  try {
    const response = await particle.listProductFirmware({ product: productID, auth: token })
    const productDefaultFirmware = response.body.filter(firmware => {
      return firmware.product_default
    })

    if (productDefaultFirmware.length !== 1) {
      return null
    }

    return productDefaultFirmware[0].version
  } catch (err) {
    console.error(err)
    return null
  }
}

/**
 * pairDoorSensor: pairs a door sensor to a Particle Boron with the current Brave sensor firmware on it
 * @param {string} deviceID       the deviceID of the Boron device to pair with
 * @param {string} doorSensorID   the hex ID of the IM21 door sensor to pair with, formatted a1,b2,c3
 * @param {string} productID      the ID of the product family which the Boron device is in
 * @param {string} token          particle auth token
 * @return {Promise<boolean>}     true if successful, false if not
 */
export async function pairDoorSensor(deviceID, doorSensorID, productID, token) {
  try {
    const response = await particle.callFunction({
      deviceId: deviceID,
      name: 'Change_IM21_Door_ID',
      argument: doorSensorID,
      product: productID,
      auth: token,
    })
    return response.body.connected && response.body.id === deviceID && response.body.return_value === 1
  } catch (err) {
    console.error(err)
    return false
  }
}

/**
 * callClientParticleFunction: call the particle function for a single device for a client
 * @param {string} deviceID       serial number of Boron device for which the function needs to be called
 * @param {string} functionName   name of the function
 * @param {string} arg            argument of the function
 * @param {string} token          particle auth token
 * @return {Promise<boolean>}     true if successful, false if not
 */
export async function callClientParticleFunction(deviceID, functionName, argument, token) {
  try {
    const response = await particle.callFunction({
      deviceId: deviceID,
      name: functionName,
      argument,
      auth: token,
    })
    return response.body.connected && response.body.id === deviceID && response.body.return_value === 1
  } catch (err) {
    console.error(err)
    return false
  }
}
