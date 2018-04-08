import gql from 'graphql-tag'
import {storeLoginToken} from '../store'

/**
 * Pass the accessToken
 * It's recommended to use https://github.com/anthonyjgrove/react-google-login
 */

export default async function ({accessToken}, apollo) {
  const result = await apollo.mutate({
    mutation: gql`
    mutation loginWithGoogle ($accessToken: String!) {
      loginWithGoogle (accessToken: $accessToken) {
        id
        token
        tokenExpires
      }
    }
    `,
    variables: {
      accessToken
    }
  })

  const {id, token, tokenExpires} = result.data.loginWithGoogle
  await storeLoginToken(id, token, new Date(tokenExpires))
  return id
}
