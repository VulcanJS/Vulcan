import resolver from './resolver'
import {HTTP} from 'meteor/http'
import {ServiceConfiguration} from 'meteor/service-configuration'

const handleAuthFromAccessToken = function ({code, redirectUri}) {
  // works with anything also...
  const accessToken = getAccessToken(code, redirectUri)
  const identity = getIdentity(accessToken)

  const serviceData = {
    ...identity,
    accessToken
  }

  return {
    serviceName: 'linkedin',
    serviceData,
    options: {profile: {name: `${identity.firstName} ${identity.lastName}`}}
  }
}

const getTokens = function () {
  const result = ServiceConfiguration.configurations.findOne({service: 'linkedin'})
  return {
    client_id: result.clientId,
    client_secret: result.secret
  }
}

const getAccessToken = function (code, redirectUri) {
  const response = HTTP.post('https://www.linkedin.com/oauth/v2/accessToken', {
    params: {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      ...getTokens()
    }
  }).data

  return response.access_token
}

const getIdentity = function (accessToken) {
  try {
    return HTTP.get('https://www.linkedin.com/v1/people/~:(id,email-address,first-name,last-name,headline)', {
      params: {
        oauth2_access_token: accessToken,
        format: 'json'
      }
    }).data
  } catch (err) {
    throw new Error('Failed to fetch identity from LinkedIn. ' + err.message)
  }
}

export default resolver(handleAuthFromAccessToken)
