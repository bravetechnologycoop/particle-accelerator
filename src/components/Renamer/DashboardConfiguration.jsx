import React, { useEffect, useState } from 'react'
import { Card, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { getSensorClients } from '../../utilities/DatabaseFunctions'
import DropdownList from '../general/DropdownList'

function DashboardConfiguration(props) {
  const {
    dashboardCheck,
    displayName,
    changeDisplayName,
    client,
    changeClient,
    clickupToken,
    password,
    changePassword,
    environment,
    displayTwilioPhoneNumber,
    twilioPhoneNumber,
    changeTwilioPhoneNumber,
  } = props

  const [clientList, setClientList] = useState([])
  const [clientLoading, setClientLoading] = useState('idle')
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    async function retrieveClients() {
      const clients = await getSensorClients(environment, clickupToken)
      setClientList(clients)
    }

    if (!initialized) {
      setClientLoading('true')
      retrieveClients()
      setClientLoading('')
      setInitialized(true)
    }
  })

  if (dashboardCheck) {
    return (
      <Card>
        <Card.Header>Dashboard Configuration</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group>
              <Form.Label>Display Name</Form.Label>
              <Form.Control value={displayName} onChange={x => changeDisplayName(x.target.value)} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Select Client</Form.Label>
              <DropdownList itemList={clientList} item={client} changeItem={changeClient} loading={clientLoading} title="Client" />
            </Form.Group>

            <Form.Group>
              <Form.Label>PA Dashboard Renamer Password (in 1Password)</Form.Label>
              <Form.Control value={password} onChange={x => changePassword(x.target.value)} type="password" placeholder="Password" />
            </Form.Group>

            {displayTwilioPhoneNumber && (
              <Form.Group>
                <Form.Label>Existing Twilio Number</Form.Label>
                <Form.Control value={twilioPhoneNumber} onChange={x => changeTwilioPhoneNumber(x.target.value)} />
              </Form.Group>
            )}
          </Form>
        </Card.Body>
      </Card>
    )
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>
}

DashboardConfiguration.propTypes = {
  dashboardCheck: PropTypes.bool.isRequired,
  client: PropTypes.string.isRequired,
  changeClient: PropTypes.func.isRequired,
  clickupToken: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  changeDisplayName: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  changePassword: PropTypes.func.isRequired,
  environment: PropTypes.string.isRequired,
  twilioPhoneNumber: PropTypes.string.isRequired,
  changeTwilioPhoneNumber: PropTypes.func.isRequired,
  displayTwilioPhoneNumber: PropTypes.bool.isRequired,
}

export default DashboardConfiguration
