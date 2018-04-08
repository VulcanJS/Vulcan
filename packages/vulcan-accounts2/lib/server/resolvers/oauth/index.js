import loginWithFacebook from './loginWithFacebook'
import loginWithGoogle from './loginWithGoogle'
import loginWithLinkedIn from './loginWithLinkedIn'
import hasService from './hasService'
import {Accounts} from 'meteor/accounts-base'

export default function (options) {
  const oauth = {}

  if (hasService(options, 'facebook')) {
    oauth.loginWithFacebook = loginWithFacebook
    try {
      Accounts.oauth.registerService('facebook')
    } catch (error) {
      // dont log this error
    }
  }

  if (hasService(options, 'google')) {
    oauth.loginWithGoogle = loginWithGoogle
    try {
      Accounts.oauth.registerService('google')
    } catch (error) {
      // dont log this error
    }
  }

  if (hasService(options, 'linkedin')) {
    oauth.loginWithLinkedIn = loginWithLinkedIn
    try {
      Accounts.oauth.registerService('linkedin')
    } catch (error) {
      // dont log this error
    }
  }

  return oauth
}
