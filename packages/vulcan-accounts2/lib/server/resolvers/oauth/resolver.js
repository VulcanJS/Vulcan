import callMethod from '../../callMethod'
import getUserLoginMethod from './getUserLoginMethod'
import {Random} from 'meteor/random'
import {OAuth} from 'meteor/oauth'
import {Meteor} from 'meteor/meteor'

export default function (handleAuthFromAccessToken) {
  return async function (root, params, context) {
    const oauthResult = handleAuthFromAccessToken(params)
    // Why any token works? :/
    const credentialToken = Random.secret()
    const credentialSecret = Random.secret()

    OAuth._storePendingCredential(credentialToken, oauthResult, credentialSecret)

    const oauth = {credentialToken, credentialSecret}
    try {
      return callMethod(context, 'login', {oauth})
    } catch (error) {
      if (error.reason === 'Email already exists.') {
        const email = oauthResult.serviceData.email || oauthResult.serviceData.emailAddress
        const method = getUserLoginMethod(email)
        if (method === 'no-password') {
          throw new Meteor.Error('no-password', 'User has no password set, go to forgot password')
        } else if (method) {
          throw new Error(`User is registered with ${method}.`)
        } else {
          throw new Error('User has no login methods')
        }
      } else {
        throw error
      }
    }
  }
}
