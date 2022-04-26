import { render, screen } from '@testing-library/react'
import React from 'react'
import App from './App'
import ActivatedDevice from './utilities/ActivatedDevice'

test('creates a new activated device from secondary constructor', () => {
  const device = ActivatedDevice.FromActivation('testDevice', 'B40TAB', '15479', 'abc123', '999', '123af')
  expect(device.deviceName).toEqual('testDevice')
  expect(device.serialNumber).toEqual('B40TAB')
  expect(device.productID).toEqual('15479')
  expect(device.deviceID).toEqual('abc123')
  expect(device.iccid).toEqual('999')
  expect(device.clickupTaskID).toEqual('123af')
  expect(device.twilioNumber).toEqual('')
})

test('creates a blank activated device', () => {
  const device = ActivatedDevice.BlankDevice()
  expect(device.deviceName).toEqual('')
  expect(device.serialNumber).toEqual('')
})

test('value equality checker between blank devices', () => {
  const device1 = ActivatedDevice.BlankDevice()
  const device2 = ActivatedDevice.BlankDevice()
  expect(device1.compareDevices(device2)).toBeTruthy()
})

test('value equality checker between two devices', () => {
  const device1 = new ActivatedDevice(
    'device name',
    'serial number',
    'product id',
    'device id',
    'iccid',
    'time stamp',
    'date stamp',
    null,
    false,
    30,
    'clickup task id',
    'clickup status',
    'clickup status colour',
    'twilio number',
    'former sensor number',
  )
  const device2 = new ActivatedDevice(
    'device name',
    'serial number',
    'product id',
    'device id',
    'iccid',
    'time stamp',
    'date stamp',
    null,
    false,
    30,
    'clickup task id',
    'clickup status',
    'clickup status colour',
    'twilio number',
    'former sensor number',
  )
  expect(device1 === device2).toBeFalsy()
  expect(device1.compareDevices(device2)).toBeTruthy()
  expect(device2.compareDevices(device1)).toBeTruthy()
})

test('two devices are that not the same returns false', () => {
  const device1 = new ActivatedDevice(
    'device name',
    'serial number',
    'product id',
    'device id',
    'iccid',
    'time stamp',
    'date stamp',
    null,
    false,
    30,
    'clickup task id',
    'clickup status',
    'clickup status colour',
    'twilio number',
    'former sensor number',
  )
  const device2 = new ActivatedDevice(
    'wrong name',
    'serial number',
    'product id',
    'device id',
    'iccid',
    'time stamp',
    'date stamp',
    null,
    false,
    30,
    'clickup task id',
    'clickup status',
    'clickup status colour',
    'twilio number',
    'former sensor number',
  )
  expect(device1 === device2).toBeFalsy()
  expect(!device1.compareDevices(device2)).toBeTruthy()
  expect(device2.compareDevices(device1)).toBeFalsy()
})
