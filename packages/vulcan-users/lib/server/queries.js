import { addGraphQLResolvers, Connectors, addGraphQLQuery, addGraphQLSchema } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core isn't loaded yet
import { Accounts } from 'meteor/accounts-base';


/**
 * How it works:
 * 
 * - accounts-password will register a login handler with all auth logic it needs: https://github.com/meteor/meteor/blob/devel/packages/accounts-password/password_server.js#L350
 * - accounts-base will define a "login" method that runs all handlers on data: https://github.com/meteor/meteor/blob/d612d7546fa446cd574b51c0ea7953253f5e4bb7/packages/accounts-base/accounts_server.js#L499
 * - we obtain an object {userId, token}, user is now logged in
 */
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


/**
 * Authentication handler
 * 
 * This code reproduces meteor/accounts-password authentication system
 * 
 * NOTE: we CAN'T reuse Meteor login method because it expects a DDP connection to be defined
 * const res = Meteor.call('login', { user: usernameOrEmail, password }); // WON'T WORK this.connection is not defined
 * @see https://github.com/meteor/meteor/issues/10937
 * 
 * NOTE: this won't work with DDP. If you want to use usual DDP features (eg you develop an actual Meteor client), 
 * use the usual Meteor connection pattern instead (see Meteor doc)
 * 
 * @param {*} usernameOrEmail 
 * @param {*} password 
 */
const authenticateWithPassword = async (options) => {
  // We reproduce the usual password auth strategy
  // Code taken from the loginHandler defined by accounts-password
  // @see https://github.com/meteor/meteor/blob/devel/packages/accounts-password/password_server.js#L282
  const { userSelector, password } = options;
  // To be done in the resolver
  //check(options, {
  //  user: userQueryValidator,
  //  password: passwordValidator
  //});
  const user = Accounts._findUserByQuery(userSelector);
  if (!user) {
    // TODO: handle errors
    throw new Error('User not found');
  }
  if (!user.services || !user.services.password ||
    !(user.services.password.bcrypt || user.services.password.srp)) {
    throw new Error('User has no password set');
  }
  const passwordCheck = Accounts._checkPassword(
    user,
    options.password
  );
  if (!passwordCheck) throw new Error('Password check failed');
  if (passwordCheck.error) throw new Error(passwordCheck.error);
  if (!passwordCheck.userId) throw new Error('No password check userId');
  const { userId } = passwordCheck;

  // TODO: meteor has some logic to check login validation (prevent brute force attacks for example)
  // @see https://github.com/meteor/meteor/blob/d612d7546fa446cd574b51c0ea7953253f5e4bb7/packages/accounts-base/accounts_server.js#L303
  //const { userId } = passwordCheck
  //checkedUser = Users.findOne(userId);
  //const attempt = {
  //  type: passwordCheck.type || "unknown",
  //  allowed: true,
  //  methodName: 'password',
  //  //methodArguments: Array.from(methodArgs)
  //};
  // _validateLogin may mutate `attempt` by adding an error and changing allowed
  // to false, but that's the only change it can make (and the user's callbacks
  // only get a clone of `attempt`).
  //this._validateLogin(methodInvocation.connection, attempt);
  //if (!attempt.allowed) {
  //  throw attempt.error;
  //}

  // generate and store the token in the db
  // code taken from _loginUser
  // @see https://github.com/meteor/meteor/blob/d612d7546fa446cd574b51c0ea7953253f5e4bb7/packages/accounts-base/accounts_server.js#L267
  const stampedLoginToken = Accounts._generateStampedLoginToken();
  Accounts._insertLoginToken(userId, stampedLoginToken);
  return {
    userId,
    token: stampedLoginToken.token
  };

  /**
   * 
   */
  //// const { username, email } = usernameOrEmail
  //// @see https://github.com/meteor/meteor/blob/devel/packages/accounts-password/password_server.js#L123
  ////console.log('accounts keys', Object.keys(Accounts));
  //// look for user
  //const user = await Accounts._findUserByQuery(usernameOrEmail);
  //console.log('user found', user);
  //// not found
  //if (!user) return { error: 'user no found' };
  //// will throw if password do not match
  //// https://github.com/meteor/meteor/blob/devel/packages/accounts-password/password_server.js#L76
  //const auth = Accounts._checkPassword(user, password);
  //if (auth.error) return auth.error;
  //console.log('auth res', auth);
  //// issue token
  //// @see https://github.com/meteor/meteor/blob/devel/packages/accounts-base/accounts_server.js#L267
  //const otherRes = Accounts._attemptLogin(Accounts, 'checkPassword', {}, auth);
  //console.log(otherRes, 'otherRes');
  //return auth;

  // Login handlers should really also check whatever field they look at in
  // options, but we don't enforce it.
  //check(options, Object);
  //
  //  const result = Accounts._runLoginHandlers(this, options);
  //
};
// authenticate?: Maybe<LoginResult>,
// methods definitions in Meteor
// https://github.com/meteor/meteor/blob/devel/packages/accounts-base/accounts_server.js#L499

addGraphQLQuery('currentUser: User');
addGraphQLSchema(`
  input AuthEmailSelector { 
    email: String 
  }
  input AuthUsernameSelector {
    username: String
  }
  # we can't mix Email and Username inputs yet (no union/merge of inputs)
  input AuthUserSelector {
    email: String
    username: String
  }
  input AuthPasswordInput {
    userSelector: AuthUserSelector
    password: String
  }
  type AuthResult {
    token: String
    user: JSON
  }
`);
addGraphQLQuery('authenticateWithPassword(input: AuthPasswordInput): AuthResult');

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
    async authenticateWithPassword(root, args, context) {
      console.log('auth resolver args', args);
      const { input } = args;
      const { userSelector, password } = input;
      // TODO smarter check based on accounts password
      if (!userSelector) {
        // TODO: keep usual error message
        return 'usernameOrEmail not defined correctly';
      }
      if (!password) {
        // TODO: keep usual error message
        return 'no password';
      }
      if (context && context.userId) {
        // TODO: keep usual error message
        return 'already auth';
      }
      return authenticateWithPassword(input);
    }
  },
};

addGraphQLResolvers(specificResolvers);