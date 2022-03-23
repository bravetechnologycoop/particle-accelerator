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

  function changeLists(newLists) {
    setLists(newLists)
    storeClickupLists(newLists)
  }

  async function getLists() {
    const response = await getAllClickupListsInSpace(clickupToken, selectedSpaceID)
    changeLists(response)
  }

  function changeSpaces(newSpaces) {
    setSpaces(newSpaces)
    storeClickupSpaces(newSpaces)
  }

  async function getSpaces() {
    const response = await getClickupSpaces(clickupToken, selectedWorkspaceID)
    changeSpaces(response)
  }

  function changeWorkspaces(newWorkspaces) {
    setWorkspaces(newWorkspaces)
    storeClickupWorkspaces(newWorkspaces)
  }

  function changeSelectedWorkspaceID(newID) {
    setSelectedWorkspaceID(newID)
    getSpaces()
  }

  function changeSelectedSpaceID(newID) {
    setSelectedSpaceID(newID)
    getLists()
  }

  useEffect(() => {
    async function tokenLogin() {
      const tempClickupToken = await getClickupAccessToken(clickupCode)
      console.log('token: ', tempClickupToken)
      changeClickupToken(tempClickupToken)
      const tempUserName = await getClickupUserName(tempClickupToken)
      changeClickupUserName(tempUserName)
      console.log('username: ', tempUserName)
      const retrievedWorkspaces = await getClickupWorkspaces(tempClickupToken)
      changeWorkspaces(retrievedWorkspaces)
    }
    console.log('clickup token: ', clickupToken)
    if (clickupCode !== null && clickupToken === '') {
      tokenLogin()
    }
    console.log('workspace ID: ', selectedWorkspaceID)
    console.log('space id: ', selectedSpaceID)
    console.log('spaces: ', spaces)
    console.log('lists: ', lists)
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
              loading={workspaces.length === 0}
              title="Workspace"
            />
            <DropdownList itemList={spaces} item={selectedSpaceID} changeItem={changeSelectedSpaceID} loading={spaces.length === 0} title="Space" />
            <DropdownList itemList={lists} item={clickupListID} changeItem={changeClickupListID} loading={lists.length === 0} title="List" />
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
  return (
    <Form>
      <Form.Control
        disabled={loading}
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
  loading: PropTypes.bool,
  item: PropTypes.string,
  changeItem: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  itemList: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
}

DropdownList.defaultProps = {
  loading: true,
  item: '',
  changeItem: () => {},
  title: '',
}

export default ClickupLogin
