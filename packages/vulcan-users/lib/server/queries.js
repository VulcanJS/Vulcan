import { addGraphQLResolvers, Connectors, addGraphQLQuery, addGraphQLSchema } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core isn't loaded yet
import { Accounts } from 'meteor/accounts-base';
// Meteor shared: https://github.com/meteor/meteor/blob/devel/packages/accounts-base/accounts_common.js
// Meteor server: @see https://github.com/meteor/meteor/blob/devel/packages/accounts-base/accounts_server.js#L523
// Meteor client: @see https://github.com/meteor/meteor/blob/devel/packages/accounts-base/accounts_client.js#L116
// @see https://github.com/accounts-js/accounts/blob/master/packages/graphql-api/src/models.ts

// Password client: https://github.com/meteor/meteor/blob/devel/packages/accounts-password/password_client.js
// Password server: https://github.com/meteor/meteor/blob/devel/packages/accounts-password/password_server.js


// Meteor token issuing: https://github.com/meteor/meteor/blob/devel/packages/accounts-base/accounts_server.js#L199

/**
 * Auth process:
 * 
 * - LoginFormInner call signIn method (line 680)
 * - Server checks that the users exists based on auth strategy (password here)
 * - Server issue a login token
 * - Client store the token  packages/vulcan-lib/lib/client/auth.js
 */

//  createUser?: Maybe<Scalars['ID']>,
//  verifyEmail?: Maybe<Scalars['Boolean']>,
//  resetPassword?: Maybe<LoginResult>,
//  sendVerificationEmail?: Maybe<Scalars['Boolean']>,
//  sendResetPasswordEmail?: Maybe<Scalars['Boolean']>,
//  addEmail?: Maybe<Scalars['Boolean']>,
//  changePassword?: Maybe<Scalars['Boolean']>,
//  twoFactorSet?: Maybe<Scalars['Boolean']>,
//  twoFactorUnset?: Maybe<Scalars['Boolean']>,
//  impersonate?: Maybe<ImpersonateReturn>,
//  refreshTokens?: Maybe<LoginResult>,
//  logout?: Maybe<Scalars['Boolean']>,
//  verifyAuthentication?: Maybe<Scalars['Boolean']>,

// Client-side: LoginFormInner signIn method
// @see https://stackoverflow.com/questions/34085553/login-user-account-on-server-side/40305131#40305131
const authenticate = async (usernameOrEmail, password) => {
  // const { username, email } = usernameOrEmail
  // @see https://github.com/meteor/meteor/blob/devel/packages/accounts-password/password_server.js#L123
  console.log('accounts keys', Object.keys(Accounts));
  // look for user
  const user = await Accounts._findUserByQuery(usernameOrEmail);
  console.log('user found', user);
  // not found
  if (!user) return { error: 'user no found' };
  // found
  const auth = Accounts._checkPassword(user, password);
  console.log('auth res', auth);
  if (auth.error) return auth.error;
  return auth;
};
// authenticate?: Maybe<LoginResult>,

addGraphQLQuery('currentUser: User');
addGraphQLSchema(`
  input UsernameOrEmailInput {
    username: String
    email: String
  }
  type AuthResult {
    any: String
  }
`);
addGraphQLQuery('authenticate(usernameOrEmail: UsernameOrEmailInput, password: String): JSON');

const specificResolvers = {
  Query: {
    async currentUser(root, args, context) {
      let user = null;
      if (context && context.userId) {
        user = await Connectors.get(context.Users, context.userId);

        if (user.services) {
          Object.keys(user.services).forEach(key => {
            user.services[key] = {};
          });
        }
      }
      return user;
    },
    async authenticate(root, args, context) {
      console.log('auth resolver args', args);
      const { usernameOrEmail, password } = args;
      if (context && context.userId) {
        return 'already auth';
      }
      return authenticate(usernameOrEmail, password);
    }
  },
};

addGraphQLResolvers(specificResolvers);