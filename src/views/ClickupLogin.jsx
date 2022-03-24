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
    console.log('clickup token: ', clickupToken)
    if (clickupCode !== null && clickupToken === '') {
      tokenLogin()
    }
  })

  if (clickupToken !== '') {
    return (
      <>
        <h1>Logged in as: {clickupUserName}</h1>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '15px' }}>
          <Card style={{ flex: '0 1 30ch' }}>
            <h4 style={{ paddingLeft: '15px', paddingTop: '15px', paddingRight: '15px' }}>Clickup Configuration</h4>
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
        </div>
      </>
    )
  }

  if (clickupToken === '') {
    return (
      <Button
        href={`https://app.clickup.com/api?client_id=${process.env.REACT_APP_CLICKUP_CLIENT_ID}&redirect_uri=https://particle-accelerator-w93d4.ondigitalocean.app/clickup`}
      >
        Log in to ClickUp
      </Button>
    )
  }
}

ClickupLogin.propTypes = {
  clickupToken: PropTypes.string,
  changeClickupToken: PropTypes.func,
  clickupUserName: PropTypes.string,
  changeClickupUserName: PropTypes.func,
  clickupListID: PropTypes.string,
  changeClickupListID: PropTypes.func,
}

ClickupLogin.defaultProps = {
  clickupToken: '',
  changeClickupToken: () => {},
  clickupUserName: '',
  changeClickupUserName: () => {},
  clickupListID: '',
  changeClickupListID: () => {},
}

function DropdownList(props) {
  const { loading, item, changeItem, itemList, title } = props
  if ((loading === 'idle' && itemList.length === 0) || loading === 'locked') {
    return (
      <Form>
        <Form.Control disabled as="select">
          <option id="" key="" value="">
            Select {title}
          </option>
        </Form.Control>
      </Form>
    )
  }
  if (loading === 'true') {
    return <Spinner animation="border" variant="primary" />
  }
  return (
    <Form>
      <Form.Control
        disabled={loading === 'true'}
        as="select"
        value={item}
        onChange={x => {
          changeItem(x.target.value)
        }}
      >
        <option id="" key="" value="">
          Select {title}
        </option>
        {itemList.map(itemInList => {
          return (
            <option key={itemInList.id} id={itemInList.id} value={itemInList.id}>
              {itemInList.name}
            </option>
          )
        })}
      </Form.Control>
    </Form>
  )
}

DropdownList.propTypes = {
  loading: PropTypes.string,
  item: PropTypes.string,
  changeItem: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  itemList: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
}

DropdownList.defaultProps = {
  loading: 'idle',
  item: '',
  changeItem: () => {},
  title: '',
}

export default ClickupLogin
