import { Card, Form } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import ValidationAttempt from '../utilities/ValidationAttempt'
import ValueBadge from '../components/general/ValueBadge'
import DeviceIDStatus from '../components/general/DeviceIDStatus'
import ICCIDStatus from '../components/general/ICCIDStatus'
import { getParticleToken } from '../utilities/StorageFunctions'
import ParticleSettings from '../utilities/ParticleSettings'

const { getDeviceDetails } = require('../utilities/ParticleFunctions')

const styles = {
  column: {
    flex: '0 0 35%',
    padding: 20,
    alignItems: 'top',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollView: {
    overflow: 'auto',
    paddingRight: '5px',
    paddingLeft: '5px',
    paddingBottom: '5px',
  },
}

/**
 * Validator:
 *
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
function Validator(props) {
  const { token, changeToken, particleSettings } = props

  useEffect(() => {
    changeToken(getParticleToken())
  })

  const [productID, setProductID] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [attemptList, setAttemptList] = useState([])

  async function pushAttempt(newAttempt) {
    const newAttemptArray = [newAttempt]
    setAttemptList(newAttemptArray.concat(attemptList))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const data = await getDeviceDetails(serialNumber, productID, token)
    if (data !== null) {
      if (data.last_ip_address !== null) {
        pushAttempt(
          new ValidationAttempt(
            serialNumber,
            data.name,
            data.id,
            data.iccid,
            data.last_heard,
            `${data.online}`,
            `${data.firmware_version}`,
            data.current_build_target,
          ),
        )
      } else {
        pushAttempt(new ValidationAttempt(serialNumber, data.name, data.id, data.iccid, 'never online', `${data.online}`, 'none', 'none'))
      }
    } else {
      pushAttempt(new ValidationAttempt('serialNumber', 'not found', '', '', '', '', '', ''))
    }
  }

  return (
    <>
      <div style={styles.column}>
        <div>
          <h3>Device Details</h3>
          <hr />
        </div>
        <div style={styles.scrollView}>
          {/* eslint-disable-next-line react/jsx-no-bind */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formProductSelect">
              <Form.Label>Select Device Product Family</Form.Label>
              <Form.Control
                as="select"
                value={productID}
                onChange={x => {
                  setProductID(x.target.value)
                }}
              >
                <option id="">No Product Family</option>
                {/* eslint-disable-next-line react/prop-types */}
                {particleSettings.productList.map(product => {
                  return (
                    <option key={`${product.id}`} id={`${product.id}`} value={`${product.id}`}>
                      {`${product.id}`.concat(': ', product.name, ' (', product.deviceType, ')')}
                    </option>
                  )
                })}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDeviceID">
              <Form.Label>Device Serial Number</Form.Label>
              <Form.Control placeholder="Serial Number" value={serialNumber} maxLength="15" onChange={x => setSerialNumber(x.target.value)} />
              <Form.Text className="text-muted">This is retrieved by scanning the barcode on the particle device.</Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>

      <div style={styles.column}>
        <div>
          <h3>Log</h3>
          <hr />
        </div>
        <div style={styles.scrollView}>
          {attemptList.map(attempt => {
            return (
              <li key={`${attempt.timeStamp}`}>
                <Card key={`${attempt.timeStamp}`}>
                  <Card.Body>
                    <Card.Title>{attempt.serialNumber}</Card.Title>
                    <Card.Subtitle>{`${attempt.timeStamp.toLocaleDateString()} ${attempt.timeStamp.toLocaleTimeString()}`}</Card.Subtitle>
                    Device Name: <ValueBadge value={attempt.deviceName} />
                    <br />
                    Device ID: <DeviceIDStatus deviceID={attempt.deviceID} />
                    <br />
                    ICCID: <ICCIDStatus iccid={attempt.iccid} />
                    <br />
                    Online: <ValueBadge value={attempt.onlineStatus} />
                    <br />
                    Last Online: <ValueBadge value={attempt.lastOnline} bg={attempt.onlineStatus} />
                    <br />
                    Brave Firmware Version: <ValueBadge value={attempt.braveFirmwareVersion} bg={attempt.onlineStatus} />
                    <br />
                    Particle Firmware Version: <ValueBadge value={attempt.particleFirmwareVersion} bg={attempt.onlineStatus} />
                  </Card.Body>
                </Card>
              </li>
            )
          })}
        </div>
      </div>
    </>
  )
}

Validator.propTypes = {
  token: PropTypes.string,
  changeToken: PropTypes.func,
  particleSettings: PropTypes.instanceOf(ParticleSettings),
}

Validator.defaultProps = {
  token: '',
  changeToken: () => {},
  particleSettings: new ParticleSettings(),
}

export default Validator
