import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { messageClientsForProduct } from '../utilities/TwilioFunctions'

function MessageClients(props) {
  const { environment } = props

  const [product, setProduct] = useState('Buttons')
  const [twilioMessage, setTwilioMessage] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
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

      const data = await messageClientsForProduct(product.toLowerCase(), environment, twilioMessage, cookies.googleIdToken)

      setStatusMessage(`Status: ${data.status}.`)
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
    <div style={messageClientsContainerStyles}>
      <div style={{ width: '40ch', padding: 20 }}>
        <h3>Message Clients</h3>
        <p>
          Only clients considered active will be messaged. Active clients are those that are sending vitals and alerts, and have at least one location
          (button or sensor) that is sending vitals and alerts.
        </p>
        <Form.Group>
          <Form.Label>Product</Form.Label>
          <Form.Select value={product} onChange={e => setProduct(e.target.value)}>
            <option>Buttons</option>
            <option>Sensor</option>
          </Form.Select>
          <Form.Text className="text-muted">
            Environment <b>{environment}</b> is selected. Is this right?
          </Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label style={{ marginTop: '10px' }}>Text Message</Form.Label>
          <Form.Control as="textarea" rows={3} value={twilioMessage} onChange={e => setTwilioMessage(e.target.value)} />
        </Form.Group>
        <Button variant="primary" style={{ marginTop: '10px' }} onClick={submitMessageClients}>
          Submit
        </Button>
        <p style={{ color: '#808080' }}>{statusMessage}</p>
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
  )
}

MessageClients.propTypes = { environment: PropTypes.string.isRequired }

export default MessageClients
