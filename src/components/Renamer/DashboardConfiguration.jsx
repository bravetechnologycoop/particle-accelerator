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
    radarType,
    changeRadarType,
    client,
    changeClient,
    clickupToken,
    stateMachine,
    changeStateMachine,
    password,
    changePassword,
    environment,
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
              <Form.Label>Radar Type</Form.Label>
              <Form.Control value={radarType} onChange={x => changeRadarType(x.target.value)} as="select">
                <option id="Innosent" value="Innosent" key="Innosent">
                  Innosent
                </option>
                <option id="XeThru" value="XeThru" key="XeThru">
                  XeThru
                </option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Select Client</Form.Label>
              <DropdownList itemList={clientList} item={client} changeItem={changeClient} loading={clientLoading} title="Client" />
            </Form.Group>

            <Form.Group>
              <Form.Label>State Machine</Form.Label>
              <Form.Control as="select" value={stateMachine} onChange={x => changeStateMachine(JSON.parse(x.target.value))}>
                <option id="true" key="true" value="true">
                  True
                </option>
                <option id="false" key="false" value="false">
                  False
                </option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control value={password} onChange={x => changePassword(x.target.value)} type="password" placeholder="Password" />
            </Form.Group>
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
  radarType: PropTypes.string.isRequired,
  changeRadarType: PropTypes.func.isRequired,
  client: PropTypes.string.isRequired,
  changeClient: PropTypes.func.isRequired,
  clickupToken: PropTypes.string.isRequired,
  stateMachine: PropTypes.bool.isRequired,
  changeStateMachine: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired,
  changeDisplayName: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  changePassword: PropTypes.func.isRequired,
  environment: PropTypes.string.isRequired,
}

export default DashboardConfiguration
