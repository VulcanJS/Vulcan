import gql from 'graphql-tag'
import {storeLoginToken} from '../store'

/**
 * Pass the accessToken
 * It's recommended to use https://github.com/keppelen/react-facebook-login
 */

export default async function ({code, redirectUri}, apollo) {
  const result = await apollo.mutate({
    mutation: gql`
    mutation loginWithLinkedIn($code: String! $redirectUri: String!) {
      loginWithLinkedIn(code: $code redirectUri: $redirectUri) {
        id
        token
        tokenExpires
      }
    }
    `,
    variables: { code, redirectUri }
  })

  const {id, token, tokenExpires} = result.data.loginWithLinkedIn
  await storeLoginToken(id, token, new Date(tokenExpires))
  return id
}
