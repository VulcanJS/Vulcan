import { ApolloLink } from 'apollo-link'
import { Accounts } from 'meteor/accounts-base'

const DEFAULT_HEADER = 'authorization'

export const MeteorAccountsLink = ({ headerName = DEFAULT_HEADER } = {}) =>
  new ApolloLink((operation, forward) => {
    const token = Accounts._storedLoginToken()

    operation.setContext(() => ({
      headers: {
        [headerName]: token
      }
    }))

    return forward(operation)
  })
