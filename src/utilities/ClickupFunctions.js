import ClickupTask from './ClickupTask'

const axios = require('axios')

/**
 * getClickupAccessToken: attempts to retrieve an authentication from ClickUp
 * @param {string} code the OAuth2 code supplied by the ClickUp OAuth redirect.
 * @return {Promise<null|*>} Access token if successful, null if unsuccessful
 */
export async function getClickupAccessToken(code) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/oauth/token?client_id=${process.env.REACT_APP_CLICKUP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLICKUP_CLIENT_SECRET}&code=${code}`
  try {
    console.log(`POST to ${url}`)
    const response = await axios.post(url)
    return response.data.access_token
  } catch (err) {
    console.log(err)
    return null
  }
}

/**
 * getClickupUserName: retrieve a user's name from ClickUp
 * @param {string} token ClickUp token
 * @return {Promise<string|*>} username if successful, empty string if not.
 */
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

/**
 * getClickupWorkspaces: retrieves all of the clickup workspaces that a user is signed in with.
 * @param {string} token clickup token
 * @return {Promise<[{name: string, id: string}]>} returns a list of workspaces and IDs if successful, empty array if not.
 */
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

/**
 * getClickupSpaces: retrieves all of the spaces inside of a clickup workspace
 * @param {string} token        clickup token
 * @param {string} workspaceID  ID of workspace to search for spaces in
 * @return {Promise<[{name: string, id: string}]>} list of spaces and names if successful, empty array if not.
 */
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

/**
 * getClickupSpaceFolders: retrieves all of the folders inside of a Clickup space.
 * @param {string} token    clickup token
 * @param {string} spaceID  ID of the space to search for folders in
 * @return {Promise<[{name: string, id: string}]>} list of folders and their IDs if successful, empty array if not.
 */
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

/**
 * getClickupListsInFolders: retrieves all of the lists in a clickup folder
 * @param {string} token     clickup token
 * @param {string} folderID  ID of the folder to search for lists in
 * @return {Promise<[{name: string, id: string}]>} a list of list names and IDs if successful, empty array if not
 */
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

/**
 * getClickupListsWithoutFolders: retrieves all of the clickup lists in a clickup space
 * @param {string} token     clickup token
 * @param {string} spaceID   ID of the space to search for lists in
 * @return {Promise<[{name: string, id: string}]>} a list of list names and IDs if successful, empty array if not
 */
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

/**
 * getAllClickupListsInSpace: retrieves all of the clickup lists in a clickup space
 * @param {string} token     clickup token
 * @param {string} spaceID   ID of the space to search for lists in
 * @return {Promise<{name: *, folderName: string, id: *}[]>}
 */
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

/**
 * getClickupStatusesInList: retrieves all of the statuses in a clickup list
 * @param {string} token   clickup token
 * @param {string} listID  ID of the list to search for statuses in
 * @return {Promise<{name: string, id: string}[]>} list of status names and ids if successful, empty array if not.
 */
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

/**
 * getClickupCustomFieldsInList: retrieves all of the custom fields in a clickup list
 * @param {string} token   clickup token
 * @param {string} listID  ID of the list to search for custom fields in
 * @return {Promise<{name: string, id: string}[]>} array of custom field names and ids if successful, empty array if not
 */
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

/**
 * createTaskInClickup: creates a task in Brave's sensor tracker corresponding to the supplied device information.
 * @param {string} token                 clickup token
 * @param {string} sensorName            name of the sensor in Particle, which will become the name of the task in clickup
 * @param {string} listID                ID of the list to place the task in
 * @param {string} deviceID              Particle device ID of the sensor/Boron
 * @param {string} serialNumber          Particle serial number of the sensor/Boron
 * @param {string} statusID              ID of the clickup status for the clickup task to bear
 * @param {{formerSensorNumber: string, deviceID: string, serialNumber: string}} customFields ids of the custom fields
 * @return {Promise<null|string>}             the ID of the created clickup task if successful, null if unsuccessful
 */
export async function createTaskInClickup(token, sensorName, listID, deviceID, serialNumber, statusID, customFields) {
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
    return response.data.id
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function createTaskInSensorTracker(token, sensorName, deviceID, serialNumber, iccid) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/list/${process.env.REACT_APP_CLICKUP_PA_TRACKER_LIST_ID}/task`
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
  const data = {
    name: sensorName,
    status: process.env.REACT_APP_CLICKUP_PA_TRACKER_DEFAULT_STATUS,
    custom_fields: [
      {
        // Former Sensor Number
        id: process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_ID_SENSOR_NAME,
        value: sensorName,
      },
      {
        // Device ID
        id: process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_ID_DEVICE_ID,
        value: deviceID,
      },
      {
        // Serial Number
        id: process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_ID_SERIAL_NUMBER,
        value: serialNumber,
      },
      {
        // ICCID
        id: process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_ID_ICCID,
        value: iccid,
      },
    ],
  }
  try {
    const response = await axios.post(url, data, config)
    return response.data.id
  } catch (err) {
    console.error(err)
    return null
  }
}

/**
 * getClickupTasksInList: retrieves all of the tasks in a clickup list
 * @param {string} listID    ID of the list to search for tasks in
 * @param {string} token     clickup token
 * @return {Promise<{}|null>}   the tasks in a list if successful, null if not.
 */
export async function getClickupTasksInList(listID, token) {
  console.log('searching listid', listID)
  console.log('searching token', token)
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/list/${listID}/task`
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    })
    console.log(response)
    return response.data.tasks
  } catch (err) {
    console.error(err)
    return null
  }
}

/**
 * getClickupTaskIDByName: retrieves the clickup task id matching exactly the supplied name to a task name in ClickUp
 * @param {string} listID         the ID of the list to search for the task in
 * @param {string} taskName       the name of the task to search for
 * @param {string} token          clickup token
 * @return {Promise<string|null>} the taskID if successful, null if not
 */
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

/**
 * getClickupTaskDataByName: retrieves data of a task in a clickupList matching the supplied task name
 * @param {string} listID              ID of the list where the task is situated
 * @param {string} taskName            The name of the task to get data for
 * @param {string} token               clickup token
 * @return {Promise<null|*>}  Data from the task if successful, null if unsuccessful
 */
export async function getClickupTaskDataByName(listID, taskName, token) {
  const tasks = await getClickupTasksInList(listID, token)
  const matchingTasks = tasks.filter(task => {
    return task.name === taskName
  })
  if (matchingTasks.length === 1) {
    return matchingTasks[0]
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

/**
 * modifyClickupTaskCustomFieldValue: modifies a custom field value of a clickup task
 * @param {string} taskID                the ID of the clickup task to modify
 * @param {string} fieldID               the field ID to modify
 * @param {string} value                 the new value for the clickup task
 * @param {string} token                 clickup token
 * @return {Promise<boolean>}   true if successful, false if not
 */
export async function modifyClickupTaskCustomFieldValue(taskID, fieldID, value, token) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/task/${taskID}/field/${fieldID}`
  const data = {
    value,
  }
  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: token,
      },
    })
    return response.status === 200
  } catch (err) {
    console.error(err)
    return false
  }
}

/**
 * modifyClickupTaskName: modifies the name of a clickup task
 * @param {string} oldName             the former name of the clickup task
 * @param {string} newName             the desired new name for the clickup task
 * @param {string} listID              the ID of the list that the task resides in
 * @param {string} token               clickup token
 * @return {Promise<boolean>} true if successful, false if not
 */
export async function modifyClickupTaskName(oldName, newName, listID, token) {
  const taskID = await getClickupTaskIDByName(listID, oldName, token)
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/task/${taskID}`
  const data = {
    name: newName,
  }
  try {
    const response = await axios.put(url, data, {
      headers: {
        Authorization: token,
      },
    })
    return response.status === 200
  } catch (err) {
    console.error(err)
    return false
  }
}

function getCustomFieldValue(customFieldObject, customFieldID) {
  const desiredField = customFieldObject.filter(field => {
    return field.id === customFieldID
  })
  if (desiredField.length === 1) {
    return desiredField[0].value
  }
  return ''
}

export async function getAllTasksInPATracker(token) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/list/${process.env.REACT_APP_CLICKUP_PA_TRACKER_LIST_ID}/task`
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    })
    return response.data.tasks.map(task => {
      return new ClickupTask(
        task.name,
        task.id,
        task.status.status,
        task.status.color,
        getCustomFieldValue(task.custom_fields, process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_ID_DEVICE_ID),
        getCustomFieldValue(task.custom_fields, process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_ID_SERIAL_NUMBER),
        getCustomFieldValue(task.custom_fields, process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_ID_ICCID),
        getCustomFieldValue(task.custom_fields, process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_ID_SENSOR_NAME),
        getCustomFieldValue(task.custom_fields, process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_DOOR_SENSOR_ID),
        getCustomFieldValue(task.custom_fields, process.env.REACT_APP_TWILIO_CUSTOM_FIELD_ID),
      )
    })
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function modifyClickupTaskStatus(taskID, newStatus, token) {
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/task/${taskID}`
  const data = {
    status: newStatus,
  }
  try {
    await axios.put(url, data, {
      headers: {
        Authorization: token,
      },
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function getClickupTaskFromID(taskID, token) {
  console.log('fetching task')
  const url = `${process.env.REACT_APP_CLICKUP_PROXY_BASE_URL}/v2/task/${taskID}`
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    })
    const rawTask = response.data
    return new ClickupTask(
      rawTask.name,
      rawTask.id,
      rawTask.status.status,
      rawTask.status.color,
      getCustomFieldValue(rawTask.custom_fields, process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_ID_DEVICE_ID),
      getCustomFieldValue(rawTask.custom_fields, process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_ID_SERIAL_NUMBER),
      getCustomFieldValue(rawTask.custom_fields, process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_ID_ICCID),
      getCustomFieldValue(rawTask.custom_fields, process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_ID_SENSOR_NAME),
      getCustomFieldValue(rawTask.custom_fields, process.env.REACT_APP_CLICKUP_CUSTOM_FIELD_DOOR_SENSOR_ID),
      getCustomFieldValue(rawTask.custom_fields, process.env.REACT_APP_TWILIO_CUSTOM_FIELD_ID),
    )
  } catch (err) {
    console.error(err)
    return null
  }
}
