import { addGraphQLMutation, addGraphQLSchema } from 'meteor/vulcan:core';
import hasService from './resolvers/oauth/hasService';

const options = {
  CreateUserProfileInput: 'name: String',
  loginWithFacebook: false,
  loginWithGoogle: false,
  loginWithLinkedIn: false,
  loginWithPassword: true,
};

/*

GraphQL Types

*/

addGraphQLMutation(`
  # Log the user out.
  logout (token: String!): SuccessResponse

  # Marks the user's email address as verified. Logs the user in afterwards.
  verifyEmail (token: String!): LoginMethodResponse

  # Send an email with a link the user can use verify their email address.
  resendVerificationEmail (email: String): SuccessResponse
`);

if (hasService(options, 'password')) {
  addGraphQLMutation(`
  # Log the user in with a password.
  loginWithPassword (username: String, email: String, password: HashedPassword, plainPassword: String): LoginMethodResponse

  # Create a new user.
  createUser (username: String, email: String, password: HashedPassword, plainPassword: String, profile: CreateUserProfileInput): LoginMethodResponse

  # Change the current user's password. Must be logged in.
  changePassword (oldPassword: HashedPassword!, newPassword: HashedPassword!): SuccessResponse

  # Request a forgot password email.
  forgotPassword (email: String!): SuccessResponse

  # Reset the password for a user using a token received in email. Logs the user in afterwards.
  resetPassword (newPassword: HashedPassword!, token: String!): LoginMethodResponse
  `);
}

if (hasService(options, 'facebook')) {
  addGraphQLMutation(`
  # Login the user with a facebook access token
  loginWithFacebook (accessToken: String!): LoginMethodResponse
  `);
}

if (hasService(options, 'google')) {
  addGraphQLMutation(`
  # Login the user with a facebook access token
  loginWithGoogle (accessToken: String!, tokenId: String): LoginMethodResponse
  `);
}

if (hasService(options, 'linkedin')) {
  addGraphQLMutation(`
  # Login the user with a facebook access token
  loginWithLinkedIn (code: String!, redirectUri: String!): LoginMethodResponse
  `);
}

addGraphQLSchema(`
# Type returned when the user logs in
type LoginMethodResponse {
  # Id of the user logged in user
  id: String!
  # Token of the connection
  token: String!
  # Expiration date for the token
  tokenExpires: Float!
  # The logged in user
  user: User
}

input CreateUserProfileInput {
  name: String
}

type SuccessResponse {
  # True if it succeeded
  success: Boolean
}

# A hashsed password
input HashedPassword {
  # The hashed password
  digest: String!
  # Algorithm used to hash the password
  algorithm: String!
}
`);

