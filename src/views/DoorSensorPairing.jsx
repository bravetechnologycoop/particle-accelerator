import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ActivatedDevice from '../utilities/ActivatedDevice'
import DoorSensorEntryCard from '../components/DoorSensorPairing/DoorSensorEntryCard'
import { retPairingList, storePairingList } from '../utilities/StorageFunctions'
import ParticleSettings from '../utilities/ParticleSettings'
import { ClickupStatuses } from '../utilities/Constants'
import DoorSensorQueueCard from '../components/DoorSensorPairing/DoorSensorQueueCard'

function DoorSensorPairing(props) {
  // eslint-disable-next-line no-unused-vars
  const { activatedDevices, changeActivatedDevices, particleToken, particleSettings, clickupToken, clickupListID, modifyActivatedDevice } = props

  const DEFAULT_TIMEOUT_INTERVAL = 10000

  // The updateInterval is for the setInterval in the pairDoorSensor function of ActivatedDevice.
  // A future project could be to have a field to customize this value.
  // eslint-disable-next-line no-unused-vars
  const [updateInterval, setUpdateInterval] = useState(DEFAULT_TIMEOUT_INTERVAL)
  // Hook to store pairing states (to display). Statuses are identified by their clickupTaskID.
  const [pairingStatuses, setPairingStatuses] = useState(retPairingList())

  /**
   * **addNewPairingStatus**: adds a new device to the pairingStatuses object/hook, with default status 'idle'.
   * @param {string} clickupTaskID  ClickUp task ID of the desired task to add to the pairingStatuses object.
   */
  function addNewPairingStatus(clickupTaskID) {
    const copyOfPairingStatuses = JSON.parse(JSON.stringify(pairingStatuses))
    copyOfPairingStatuses[clickupTaskID] = 'idle'
    setPairingStatuses(copyOfPairingStatuses)
    storePairingList(copyOfPairingStatuses)
  }

  /**
   * **changeDevicePairingState**: modifies a device's pairing state in the pairingStatuses object.
   * @param {string} clickupTaskID    ClickUp task ID of the desired task to modify in the pairingStatuses object.
   * @param {string} newStatus        The new status of pairing to write to the device
   */
  function changeDevicePairingState(clickupTaskID, newStatus) {
    const copyOfPairingStatuses = JSON.parse(JSON.stringify(pairingStatuses))
    copyOfPairingStatuses[clickupTaskID] = newStatus
    setPairingStatuses(copyOfPairingStatuses)
    storePairingList(copyOfPairingStatuses)
  }

  /**
   * **submitDeviceHandler**: enters a device into a 'pairing' state and calls the pairDoorSensor method on an ActivatedDevice
   * @param {ActivatedDevice} device  device to initiate pairing a door sensor with.
   * @param {string} doorSensorID     IM21 door sensor ID to pair with, formatted a1,b2,c3.
   */
  function submitDeviceHandler(device, doorSensorID) {
    addNewPairingStatus(device.doorSensorID)
    device.pairDoorSensor(particleToken, doorSensorID, updateInterval, changeDevicePairingState, modifyActivatedDevice, clickupToken)
  }

  const styles = {
    parent: {
      flex: '1 1',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      height: 'inherit',
      padding: 20,
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1',
    },
    scrollView: {
      flex: '1 1',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    },
    toggleButton: {
      fontSize: 'small',
    },
  }

  return (
    <div style={styles.parent}>
      <div style={styles.column}>
        <h3>Select Device</h3>
        <hr />
        <div style={styles.scrollView}>
          {activatedDevices
            .filter(device => {
              return device.clickupStatus === ClickupStatuses.activation.name
            })
            .map(device => {
              return <DoorSensorEntryCard submitDeviceHandler={submitDeviceHandler} device={device} key={device.clickupTaskID} />
            })}
        </div>
      </div>
      <div style={styles.column}>
        <h3>Queue</h3>
        <hr />
        <div style={styles.scrollView}>
          {activatedDevices
            .filter(device => {
              return device.inPairingList
            })
            .map(device => {
              return (
                <li style={{ paddingTop: '0.1ch', paddingBottom: '0.2ch', listStyle: 'none' }} key={`${device.dateStamp}${device.timeStamp}`}>
                  <DoorSensorQueueCard device={device} status={pairingStatuses[device.clickupTaskID]} reactStateHandler={modifyActivatedDevice} />
                </li>
              )
            })}
        </div>
      </div>
      <div style={styles.column}>
        <h3>Successful Pairings</h3>
        <hr />
        <div style={styles.scrollView}>
          {activatedDevices
            .filter(device => {
              return device.doorSensorID !== '' && device.doorSensorID !== null && device.doorSensorID !== undefined
            })
            .map(device => {
              return (
                <li style={{ paddingTop: '0.1ch', paddingBottom: '0.2ch', listStyle: 'none' }} key={`${device.dateStamp}${device.timeStamp}`}>
                  <DoorSensorQueueCard device={device} status="paired" />
                </li>
              )
            })}
        </div>
      </div>
    </div>
  )
}

DoorSensorPairing.propTypes = {
  activatedDevices: PropTypes.arrayOf(PropTypes.instanceOf(ActivatedDevice)).isRequired,
  changeActivatedDevices: PropTypes.func.isRequired,
  particleToken: PropTypes.string.isRequired,
  particleSettings: PropTypes.instanceOf(ParticleSettings).isRequired,
  clickupToken: PropTypes.string.isRequired,
  clickupListID: PropTypes.string.isRequired,
  modifyActivatedDevice: PropTypes.func.isRequired,
}

export default DoorSensorPairing
