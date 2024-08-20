import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import { messageClientsForProduct } from '../utilities/TwilioFunctions'

function MessageClients(props) {
  const { environment } = props

  const [product, setProduct] = useState('Buttons')
  const [twilioMessage, setTwilioMessage] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [showPrompt, setShowPrompt] = useState(false)
  const [successfullyMessaged, setSuccessfullyMessaged] = useState([])
  const [failedToMessage, setFailedToMessage] = useState([])

  const [cookies] = useCookies(['googleIdToken'])

  const messageClientsContainerStyles = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    alignContent: 'flex-start',
    maxWidth: '1600px',
    height: '100vh',
    overflowY: 'scroll',
  }

  const summaryColumnStyles = {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    height: '100%',
    overflowY: 'scroll',
  }

  const twilioTraceObjectStyles = {
    marginBottom: '4px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    padding: '8px',
  }

  const monospaceStyles = {
    margin: '0 2px',
    borderRadius: '4px',
    padding: '2px',
    backgroundColor: '#e8e8e8',
    fontFamily: 'monospace',
    fontSize: '10pt',
  }

  async function submitMessageClients() {
    try {
      setStatusMessage('Waiting for response...')
      setSuccessfullyMessaged([])
      setFailedToMessage([])
      setShowPrompt(false)

      const data = await messageClientsForProduct(product.toLowerCase(), environment, twilioMessage, cookies.googleIdToken)

      setStatusMessage(`Status: ${data.status}. Sent "${twilioMessage}" to the active clients in the ${environment} environment.`)
      setTwilioMessage('')
      setSuccessfullyMessaged(data.successfullyMessaged)
      setFailedToMessage(data.failedToMessage)
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  function makeTwilioTraceObjectElement(twilioTraceObject) {
    return (
      <div style={twilioTraceObjectStyles}>
        <p style={{ margin: '0' }}>
          Client: <b>{twilioTraceObject.clientDisplayName}</b>
          <br />
          Client ID: <span style={monospaceStyles}>{twilioTraceObject.clientId}</span>
          <br />
          To: <span style={monospaceStyles}>{twilioTraceObject.to}</span>
          <br />
          From: <span style={monospaceStyles}>{twilioTraceObject.from}</span>
        </p>
      </div>
    )
  }

  return (
    <>
      <div style={messageClientsContainerStyles}>
        <div style={{ width: '40ch', padding: 20 }}>
          <h3>Message Clients</h3>
          <p>
            Only clients considered active will be messaged. Active clients are those that are sending vitals and alerts, and have at least one
            location (button or sensor) that is sending vitals and alerts.
          </p>
          <h4>Downtime Messages</h4>
          <p>
            Notice: Your Brave Buttons System is down for maintenance. During this time, Button presses will not trigger an alert. You will receive
            another text message when everything is back online. Thank you for your patience. Have a nice day.
          </p>
          <p>
            Notice: Your Brave Sensor System is down for maintenance. During this time, you may not receive bathroom alerts. You will receive another
            text message when everything is back online. Thank you for your patience. Have a nice day!
          </p>
          <h4>Uptime Messages</h4>
          <p>Notice: Your Brave Buttons System is now back online and functioning normally. Thank you!</p>
          <p>Notice: Your Brave Sensor System is now back online and functioning normally. Thank you!</p>
          <Form.Group>
            <Form.Label>Product</Form.Label>
            <Form.Select value={product} onChange={e => setProduct(e.target.value)}>
              <option>Buttons</option>
              <option>Sensor</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ marginTop: '10px' }}>Text Message</Form.Label>
            <Form.Control as="textarea" rows={6} value={twilioMessage} onChange={e => setTwilioMessage(e.target.value)} />
          </Form.Group>
          <Button variant="primary" style={{ marginTop: '10px' }} onClick={() => setShowPrompt(true)}>
            Submit
          </Button>
          <p style={{ color: '#808080', marginTop: '10px' }}>{statusMessage}</p>
        </div>
        <div style={{ flexGrow: '1', padding: 20 }}>
          {successfullyMessaged.length === 0 ? (
            ''
          ) : (
            <>
              <h3>Successfully Messaged</h3>
              <div style={summaryColumnStyles}>{successfullyMessaged.map(makeTwilioTraceObjectElement)}</div>
            </>
          )}
        </div>
        <div style={{ flexGrow: '1', padding: 20 }}>
          {failedToMessage.length === 0 ? (
            ''
          ) : (
            <>
              <h3>Failed to message</h3>
              <div style={summaryColumnStyles}>{failedToMessage.map(makeTwilioTraceObjectElement)}</div>
            </>
          )}
        </div>
      </div>
      <Modal show={showPrompt} onHide={() => setShowPrompt(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Message Clients</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to send &ldquo;{twilioMessage}&rdquo; to the active clients in the <b>{environment}</b> environment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPrompt(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitMessageClients}>
            I&apos;m sure
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

MessageClients.propTypes = { environment: PropTypes.string.isRequired }

export default MessageClients
