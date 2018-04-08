import hashPassword from './hashPassword'
import gql from 'graphql-tag'
import {storeLoginToken} from './store'

export default async function ({username, email, password, profile}, apollo) {
  const result = await apollo.mutate({
    mutation: gql`
    mutation createUser ($username: String, $email: String, $password: HashedPassword!, $profile: CreateUserProfileInput) {
      createUser (username: $username, email: $email, password: $password, profile: $profile) {
        id
        token
        tokenExpires
      }
    }
    `,
    variables: {
      username,
      email,
      password: hashPassword(password),
      profile
    }
  })

  const {id, token, tokenExpires} = result.data.createUser
  await storeLoginToken(id, token, new Date(tokenExpires))
  return id
}
