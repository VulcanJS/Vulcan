import gql from 'graphql-tag'
import {storeLoginToken} from '../store'

/**
 * Pass the accessToken
 * It's recommended to use https://github.com/keppelen/react-facebook-login
 */

export default async function ({accessToken}, apollo) {
  const result = await apollo.mutate({
    mutation: gql`
    mutation loginWithFacebook ($accessToken: String!) {
      loginWithFacebook (accessToken: $accessToken) {
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

  const {id, token, tokenExpires} = result.data.loginWithFacebook
  await storeLoginToken(id, token, new Date(tokenExpires))
  return id
}
