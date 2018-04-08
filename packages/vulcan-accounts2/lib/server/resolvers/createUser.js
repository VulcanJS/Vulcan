import callMethod from '../callMethod'
import hashPassword from './hashPassword'
import {Meteor} from 'meteor/meteor'

export default async function (root, options, context) {
  Meteor._nodeCodeMustBeInFiber()
  if (!options.password && !options.plainPassword) {
    throw new Error('Password is required')
  }
  if (!options.password) {
    options.password = hashPassword(options.plainPassword)
    delete options.plainPassword
  }
  return callMethod(context, 'createUser', options)
}
