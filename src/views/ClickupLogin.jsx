import Button from 'react-bootstrap/Button'
import React, { useEffect, useState } from 'react'
import { Card, Form, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import {
  getAllClickupListsInSpace,
  getClickupAccessToken,
  getClickupSpaces,
  getClickupUserName,
  getClickupWorkspaces,
} from '../utilities/ClickupFunctions'
import {
  retClickupLists,
  retClickupSpaceID,
  retClickupSpaces,
  retClickupWorkspaceID,
  retClickupWorkspaces,
  storeClickupLists,
  storeClickupSpaceID,
  storeClickupSpaces,
  storeClickupWorkspaceID,
  storeClickupWorkspaces,
} from '../utilities/StorageFunctions'
import DropdownList from '../components/general/DropdownList'

function ClickupLogin(props) {
  const { clickupToken, changeClickupToken, clickupUserName, changeClickupUserName, clickupListID, changeClickupListID } = props

  const urlParams = new URLSearchParams(window.location.search)
  const clickupCode = urlParams.get('code')

  const [workspaces, setWorkspaces] = useState(retClickupWorkspaces)
  const [spaces, setSpaces] = useState(retClickupSpaces)
  const [lists, setLists] = useState(retClickupLists)

  const [selectedWorkspaceID, setSelectedWorkspaceID] = useState(retClickupWorkspaceID)
  const [selectedSpaceID, setSelectedSpaceID] = useState(retClickupSpaceID)

  const [workspacesLoading, setWorkspacesLoading] = useState('idle')
  const [spacesLoading, setSpacesLoading] = useState('idle')
  const [listsLoading, setListsLoading] = useState('idle')

  function changeLists(newLists) {
    setLists(newLists)
    storeClickupLists(newLists)
  }

  async function getLists(newSpaceID) {
    setListsLoading('true')
    const response = await getAllClickupListsInSpace(clickupToken, newSpaceID)
    changeLists(response)
    setListsLoading('false')
  }

  function changeSpaces(newSpaces) {
    setSpaces(newSpaces)
    storeClickupSpaces(newSpaces)
  }

  async function getSpaces(newWorkspaceID) {
    setSpacesLoading('true')
    const response = await getClickupSpaces(clickupToken, newWorkspaceID)
    changeSpaces(response)
    setSpacesLoading('false')
  }

  function changeWorkspaces(newWorkspaces) {
    setWorkspaces(newWorkspaces)
    storeClickupWorkspaces(newWorkspaces)
    setWorkspacesLoading('false')
  }

  function changeSelectedSpaceID(newID) {
    if (newID === '') {
      setSpacesLoading('locked')
    }
    changeClickupListID('')
    setSelectedSpaceID(newID)
    storeClickupSpaceID(newID)
    if (newID !== '') {
      getLists(newID)
    }
  }

  function changeSelectedWorkspaceID(newID) {
    if (newID === '') {
      setListsLoading('locked')
      setSpacesLoading('locked')
    }
    changeClickupListID('')
    changeSelectedSpaceID('')
    setSelectedWorkspaceID(newID)
    storeClickupWorkspaceID(newID)
    if (newID !== '') {
      getSpaces(newID)
    }
  }

  useEffect(() => {
    async function tokenLogin() {
      const tempClickupToken = await getClickupAccessToken(clickupCode)
      console.log('token: ', tempClickupToken)
      changeClickupToken(tempClickupToken)
      const tempUserName = await getClickupUserName(tempClickupToken)
      changeClickupUserName(tempUserName)
      console.log('username: ', tempUserName)
      setWorkspacesLoading('true')
      const retrievedWorkspaces = await getClickupWorkspaces(tempClickupToken)
      changeWorkspaces(retrievedWorkspaces)
    }
    if (clickupCode !== null && clickupToken === '') {
      tokenLogin()
    }
  })

  if (clickupToken !== '') {
    return (
      <div style={{ padding: 20 }}>
        <h1>Logged in as: {clickupUserName}</h1>
        <div>
          <Button variant="danger" onClick={() => changeClickupToken('')}>
            Log Out of Clickup
          </Button>
        </div>
        {/* Old component for customizing clickup list configurations. Deprecated to move towards environment variables. */}
        {/* <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '15px' }}>
          <Card style={{ flex: '0 1 30ch' }}>
            <h4 style={{ paddingLeft: '15px', paddingTop: '15px', paddingRight: '15px' }}>Clickup List Configuration</h4>
            <Form>
              <h6 style={{ paddingLeft: '15px', paddingTop: '10px', paddingBottom: '3px' }}>Workspace</h6>
              <div style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                <DropdownList
                  itemList={workspaces}
                  item={selectedWorkspaceID}
                  changeItem={changeSelectedWorkspaceID}
                  loading={workspacesLoading}
                  title="Workspace"
                />
              </div>
              <h6 style={{ paddingLeft: '15px', paddingTop: '10px', paddingBottom: '3px' }}>Space</h6>
              <div style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                <DropdownList itemList={spaces} item={selectedSpaceID} changeItem={changeSelectedSpaceID} loading={spacesLoading} title="Space" />
              </div>
              <h6 style={{ paddingLeft: '15px', paddingTop: '10px', paddingBottom: '3px' }}>List</h6>
              <div style={{ paddingLeft: '15px', paddingRight: '15px', paddingBottom: '15px' }}>
                <DropdownList itemList={lists} item={clickupListID} changeItem={changeClickupListID} loading={listsLoading} title="List" />
              </div>
            </Form>
          </Card>
        </div> */}
      </div>
    )
  }

  if (clickupToken === '') {
    return (
      <div style={{ padding: 20 }}>
        <Button
          href={`https://app.clickup.com/api?client_id=${process.env.REACT_APP_CLICKUP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_DOMAIN}/clickup`}
        >
          Log in to ClickUp
        </Button>
      </div>
    )
  }
}

ClickupLogin.propTypes = {
  clickupToken: PropTypes.string.isRequired,
  changeClickupToken: PropTypes.func.isRequired,
  clickupUserName: PropTypes.string.isRequired,
  changeClickupUserName: PropTypes.func.isRequired,
  clickupListID: PropTypes.string.isRequired,
  changeClickupListID: PropTypes.func.isRequired,
}

export default ClickupLogin
