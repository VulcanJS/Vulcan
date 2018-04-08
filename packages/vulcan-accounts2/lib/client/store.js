
const onChangeCallbacks = []

let tokenStore = {
  set: async function ({userId, token, tokenExpires}) {
    global.localStorage['Meteor.userId'] = userId
    global.localStorage['Meteor.loginToken'] = token
    global.localStorage['Meteor.loginTokenExpires'] = tokenExpires.toString()
  },
  get: async function () {
    return {
      userId: global.localStorage['Meteor.userId'],
      token: global.localStorage['Meteor.loginToken'],
      tokenExpires: global.localStorage['Meteor.loginTokenExpires']
    }
  }
}

export const setTokenStore = function (newStore) {
  tokenStore = newStore
}

export const storeLoginToken = async function (userId, token, tokenExpires) {
  await tokenStore.set({userId, token, tokenExpires})
  await tokenDidChange()
}

export const getLoginToken = async function () {
  const {token} = await tokenStore.get()
  return token
}

export const getUserId = async function () {
  const {userId} = await tokenStore.get()
  return userId
}

const tokenDidChange = async function () {
  const newData = await tokenStore.get()
  for (const callback of onChangeCallbacks) {
    callback(newData)
  }
}

export const onTokenChange = function (callback) {
  onChangeCallbacks.push(callback)
}

export const resetStore = async function () {
  await storeLoginToken('', '', '')
}
