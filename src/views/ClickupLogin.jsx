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
  retClickupSpaces,
  retClickupWorkspaces,
  storeClickupLists,
  storeClickupSpaces,
  storeClickupWorkspaces,
} from '../utilities/StorageFunctions'

function ClickupLogin(props) {
  const { clickupToken, changeClickupToken, clickupUserName, changeClickupUserName, clickupListID, changeClickupListID } = props

  const urlParams = new URLSearchParams(window.location.search)
  const clickupCode = urlParams.get('code')

  const [workspaces, setWorkspaces] = useState(retClickupWorkspaces)
  const [spaces, setSpaces] = useState(retClickupSpaces)
  const [lists, setLists] = useState(retClickupLists)

  const [selectedWorkspaceID, setSelectedWorkspaceID] = useState('')
  const [selectedSpaceID, setSelectedSpaceID] = useState('')

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

  function changeSelectedWorkspaceID(newID) {
    setListsLoading('idle')
    setSelectedWorkspaceID(newID)
    getSpaces(newID)
  }

  function changeSelectedSpaceID(newID) {
    setSelectedSpaceID(newID)
    getLists(newID)
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
        <h1>Logged In as {clickupUserName}</h1>
        <Card>
          <Card.Title>Set Clickup Configuration</Card.Title>
          {selectedWorkspaceID}
          {selectedSpaceID}
          {clickupListID}
          <Form>
            <DropdownList
              itemList={workspaces}
              item={selectedWorkspaceID}
              changeItem={changeSelectedWorkspaceID}
              loading={workspacesLoading}
              title="Workspace"
            />
            <DropdownList itemList={spaces} item={selectedSpaceID} changeItem={changeSelectedSpaceID} loading={spacesLoading} title="Space" />
            <DropdownList itemList={lists} item={clickupListID} changeItem={changeClickupListID} loading={listsLoading} title="List" />
          </Form>
        </Card>
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
  if (loading === 'idle') {
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
