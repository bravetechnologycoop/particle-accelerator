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

  function changeWorkspaces(newWorkspaces) {
    setWorkspaces(newWorkspaces)
    storeClickupWorkspaces(newWorkspaces)
  }

  function changeSpaces(newSpaces) {
    setSpaces(newSpaces)
    storeClickupSpaces(newSpaces)
  }

  function changeLists(newLists) {
    setLists(newLists)
    storeClickupLists(newLists)
  }

  const [selectedWorkspaceID, setSelectedWorkspaceID] = useState('')
  const [selectedSpaceID, setSelectedSpaceID] = useState('')

  function changeSelectedWorkspaceID(newID) {
    setSelectedWorkspaceID(newID)
  }

  function changeSelectedSpaceID(newID) {
    setSelectedSpaceID(newID)
  }

  async function getSpaces() {
    const response = await getClickupSpaces(clickupToken, selectedWorkspaceID)
    changeSpaces(response)
  }

  async function getLists() {
    const response = await getAllClickupListsInSpace(clickupToken, selectedSpaceID)
    changeLists(response)
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
      setWorkspaces(retrievedWorkspaces)
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
          <Form>
            <DropdownList
              itemList={workspaces}
              item={selectedWorkspaceID}
              changeItem={changeSelectedWorkspaceID}
              loading={workspaces === []}
              title="Workspace"
              nextFunction={getSpaces}
            />
            <DropdownList
              itemList={spaces}
              item={selectedSpaceID}
              changeItem={changeSelectedSpaceID}
              loading={spaces === []}
              title="Space"
              nextFunction={getLists}
            />
            <DropdownList
              itemList={lists}
              item={clickupListID}
              changeItem={changeClickupListID}
              loading={lists === []}
              title="List"
              nextFunction={() => console.log(clickupListID)}
            />
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
  const { loading, item, changeItem, itemList, title, nextFunction } = props
  return (
    <Form>
      <Form.Control
        disabled={loading}
        as="select"
        value={item}
        onChange={x => {
          changeItem(x.target.value)
          nextFunction()
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
  nextFunction: PropTypes.func,
}

DropdownList.defaultProps = {
  loading: true,
  item: '',
  changeItem: () => {},
  title: '',
  nextFunction: () => {},
}

export default ClickupLogin
