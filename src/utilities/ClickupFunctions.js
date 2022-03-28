const axios = require('axios')

// eslint-disable-next-line import/prefer-default-export
export async function getClickupAccessToken(code) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/oauth/token?client_id=${process.env.REACT_APP_CLICKUP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLICKUP_CLIENT_SECRET}&code=${code}`
  try {
    console.log(`POST to ${url}`)
    const response = await axios.post(url)
    console.log(response.data.access_token)
    return response.data.access_token
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getClickupUserName(token) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/user`
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(response)
    return response.data.user.username
  } catch (err) {
    console.error(err)
    return ''
  }
}

export async function getClickupWorkspaces(token) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/team`
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(response)
    return response.data.teams.map(team => {
      return { name: team.name, id: team.id }
    })
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getClickupSpaces(token, workspaceID) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/team/${workspaceID}/space`
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('spaces: ', response)
    return response.data.spaces.map(space => {
      return { name: space.name, id: space.id }
    })
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getClickupSpaceFolders(token, spaceID) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/space/${spaceID}/folder`
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('folders: ', response)
    return response.data.folders.map(folder => {
      return { name: folder.name, id: folder.id }
    })
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getClickupListsInFolders(token, folderID) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/folder/${folderID}/list`
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(`lists in folder ${folderID}: `, response)
    return response.data.lists.map(list => {
      return { name: list.name, id: list.id }
    })
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getClickupListsWithoutFolders(token, spaceID) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/space/${spaceID}/list`
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(`lists in space ${spaceID}: `, response)
    return response.data.lists.map(list => {
      return { name: list.name, id: list.id }
    })
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getAllClickupListsInSpace(token, spaceID) {
  async function getTaggedListsInFolders(localToken, folderObject) {
    const listsInFolder = await getClickupListsInFolders(localToken, folderObject.id)
    return listsInFolder.map(list => {
      return { folderName: folderObject.name, name: list.name, id: list.id }
    })
  }
  const folders = await getClickupSpaceFolders(token, spaceID)
  let folderLists
  if (folders !== []) {
    folderLists = (await Promise.all(folders.map(folder => getTaggedListsInFolders(token, folder)))).flat()
  }
  const listsWithoutFolders = await getClickupListsWithoutFolders(token, spaceID)
  const taggedListsWithoutFolders = listsWithoutFolders.map(list => {
    return { folderName: '', name: list.name, id: list.id }
  })
  return taggedListsWithoutFolders.concat(folderLists)
}

export async function getClickupStatusesInList(token, listID) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/list/${listID}`
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data.statuses.map(status => {
      return { name: status.status.replace(/(^\w)|(\s+\w)/g, letter => letter.toUpperCase()), id: status.status }
    })
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getClickupCustomFieldsInList(token, listID) {
  console.log('token', token)
  console.log('listID', listID)
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/list/${listID}/field`
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data.fields.map(field => {
      return { name: field.name, id: field.id }
    })
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function createTaskInSensorTracker(token, sensorName, listID, deviceID, serialNumber, statusID, customFields) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/list/${listID}/task`
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
  const data = {
    name: sensorName,
    status: statusID,
    custom_fields: [
      {
        // Former Sensor Number
        id: customFields.formerSensorNumber,
        value: sensorName,
      },
      {
        // Device ID
        id: customFields.deviceID,
        value: deviceID,
      },
      {
        // Serial Number
        id: customFields.serialNumber,
        value: serialNumber,
      },
    ],
  }
  try {
    const response = await axios.post(url, data, config)
    console.log(response)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function getClickupTasksInList(listID, token) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/list/${listID}/task`
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer: ${token}`,
      },
    })
    return response.data.tasks
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function getClickupTaskIDByName(listID, taskName, token) {
  const tasks = await getClickupTasksInList(listID, token)
  const matchingTasks = tasks.filter(task => {
    return task.name === taskName
  })
  if (matchingTasks.length === 1) {
    return matchingTasks[0].id
  }
  if (matchingTasks.length > 1) {
    console.error(`Error at getClickupTaskByName: Multiple Tasks Found Named ${taskName} in list with ID: ${listID}`)
    return null
  }
  if (matchingTasks.length === 0) {
    console.error(`Error at getClickupTaskByName: No tasks named ${taskName} found in list with ID: ${listID}`)
    return null
  }
  console.error(`Unknown error finding tasks in ${listID} with the name: ${taskName}`)
}

export async function modifyClickupTaskCustomFieldValue(taskID, fieldID, value, token) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/task/${taskID}/field/${fieldID}`
  const data = {
    value,
  }
  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer: ${token}`,
      },
    })
    return response.status === 200
  } catch (err) {
    console.error(err)
    return false
  }
}
