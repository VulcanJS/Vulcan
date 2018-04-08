import {Meteor} from 'meteor/meteor'
import getConnection from './getConnection'

export default function (passedContext, name, ...args) {
  const handler = Meteor.default_server.method_handlers[name]
  if (!handler) {
    throw new Meteor.Error(404, `Method '${name}' not found`)
  }

  const connection = getConnection()
  const context = {
    connection,
    setUserId (userId) {
      /**
       * This will not make any changes if you don\'t pass setUserId function in context
       */
    },
    ...passedContext
  }

  return handler.call(context, ...args)
}
