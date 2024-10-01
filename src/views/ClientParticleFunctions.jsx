import { Form, Alert } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { useCookies } from 'react-cookie'
import PropTypes from 'prop-types'
import { getParticleToken } from '../utilities/StorageFunctions'

const { getClientDevices } = require('../utilities/DatabaseFunctions')
const { callClientParticleFunction } = require('../utilities/ParticleFunctions')

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

const deviceFunctionList = ['Force_Reset', 'HELP']

function ClientParticleFunctons(props) {
  const { token, changeToken, environment } = props

  const [cookies] = useCookies(['googleIdToken'])
  const [displayName, setDisplayName] = useState('')
  const [functionName, setFunctionName] = useState('')
  const [argument, setArgument] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    changeToken(getParticleToken())
  }, [changeToken])

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      console.log(displayName)

      const allClientDevices = await getClientDevices(displayName, environment, cookies.googleIdToken)

      if (!allClientDevices || allClientDevices.length === 0) {
        console.error('No client devices found.')
        setErrorMessage('No client devices found for this client name.')
        setShowAlert(true)
        return
      }

      console.log('Retrieved devices:', allClientDevices)

      const result = await callClientParticleFunction({
        deviceID: allClientDevices,
        functionName,
        argument,
        token,
      })

      console.log('Particle function result:', result)
      setErrorMessage('Particle function called successfully!')
      setShowAlert(true)
    } catch (error) {
      console.error('Error retrieving devices or calling particle function:', error)
      setErrorMessage('An error occurred while calling the particle function. Please try again.')
      setShowAlert(true)
    }
  }

  return (
    <div style={styles.column}>
      <div>
        <h3>Client Particle Functions</h3>
        <hr />
      </div>

      {showAlert && (
        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
          {errorMessage}
        </Alert>
      )}

      <div style={styles.scrollView}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formDisplayName">
            <Form.Label>Client Name</Form.Label>
            <Form.Control placeholder="Client Name" value={displayName} onChange={x => setDisplayName(x.target.value)} />
            <Form.Text className="text-muted">The display name of the client in the database.</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFunctionSelect">
            <Form.Label>Select Particle Function</Form.Label>
            <Form.Control as="select" value={functionName} onChange={x => setFunctionName(x.target.value)}>
              {deviceFunctionList.map(func => (
                <option key={func} value={func}>
                  {func}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formArgument">
            <Form.Label>Argument</Form.Label>
            <Form.Control placeholder="Argument" value={argument} maxLength="15" onChange={x => setArgument(x.target.value)} />
            <Form.Text className="text-muted">The argument for the function trying to be called.</Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  )
}

ClientParticleFunctons.propTypes = {
  token: PropTypes.string.isRequired,
  changeToken: PropTypes.func.isRequired,
  environment: PropTypes.string.isRequired,
}

export default ClientParticleFunctons
