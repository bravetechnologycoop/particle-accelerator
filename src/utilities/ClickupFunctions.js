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
    return response.teams.map(team => {
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
    return response.spaces.map(space => {
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
    return response.folders.map(folder => {
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
    return response.lists.map(list => {
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
    return response.lists.map(list => {
      return { name: list.name, id: list.id }
    })
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getAllClickupListsInSpace(token, spaceID) {
  const folders = await getClickupSpaceFolders(token, spaceID)
  const allLists = []
  if (folders !== []) {
    for (const folder of folders) {
      const listsInFolder = await getClickupListsInFolders(token, folder.folderID)
      const taggedListsInFolder = listsInFolder.map(list => {
        return { folderName: folder.name, listName: list.name, listID: list.id }
      })
      allLists.push(taggedListsInFolder)
    }
  }
  const listsWithoutFolders = await getClickupListsWithoutFolders(token, spaceID)
  const taggedListsWithoutFolders = listsWithoutFolders.map(list => {
    return { folderName: '', listName: list.name, listID: list.id }
  })
  allLists.push(taggedListsWithoutFolders)
  return allLists
}
