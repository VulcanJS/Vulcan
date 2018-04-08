import gql from 'graphql-tag'

export default async function ({email}, apollo) {
  const result = await apollo.mutate({
    mutation: gql`mutation resendVerificationEmail($email: String) {
      resendVerificationEmail(email: $email) {
        success
      }
    }`,
    variables: {
      email
    }
  })

  const {success} = result.data.resendVerificationEmail
  return success
}
