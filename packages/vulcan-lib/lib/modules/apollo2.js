import ApolloClient from "apollo-boost";
import { Accounts } from 'meteor/accounts-base'

export const apolloClient = new ApolloClient({
  uri: '/graphql',
  request: operation =>
    operation.setContext(() => ({
      headers: {
        authorization: Accounts._storedLoginToken()
      }
    }))
})