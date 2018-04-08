import resolver from './resolver'
import {HTTP} from 'meteor/http'

const handleAuthFromAccessToken = function ({accessToken}) {
  const identity = getIdentity(accessToken)

  const serviceData = {
    ...identity,
    accessToken
  }

  return {
    serviceName: 'facebook',
    serviceData,
    options: {profile: {name: identity.name}}
  }
}

const getIdentity = function (accessToken) {
  const fields = ['id', 'email', 'name', 'first_name', 'last_name', 'link', 'gender', 'locale', 'age_range']
  try {
    return HTTP.get('https://graph.facebook.com/v2.8/me', {
      params: {
        access_token: accessToken,
        fields: fields.join(',')
      }
    }).data
  } catch (err) {
    throw new Error('Failed to fetch identity from Google. ' + err.message)
  }
}

export default resolver(handleAuthFromAccessToken)
