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
