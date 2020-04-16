import { Accounts } from 'meteor/accounts-base';
import SimpleSchema from 'simpl-schema';

/**
 * Validate user selector used during login (either email or username but could be any Mongo selector)
 */
export const userSelectorSchema = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
  },
  username: {
    type: String,
    optional: true,
  },
});
userSelectorSchema.addDocValidator(userSelector => {
  if (!userSelector) return [{ name: 'userSelector', type: 'MUST_HAVE_USER_SELECTOR' }];
  const { email, username } = userSelector;
  if (!(email || username)) return [{ name: 'userSelector', type: 'MUST_HAVE_USERNAME_OR_EMAIL' }];
  return [];
});

/**
 * How Meteor auth works:
 *
 * - accounts-password will register a login handler with all auth logic it needs:
 * https://github.com/meteor/meteor/blob/devel/packages/accounts-password/password_server.js#L350
 * - accounts-base will define a "login" method that runs all handlers on data: 
 * https://github.com/meteor/meteor/blob/d612d7546fa446cd574b51c0ea7953253f5e4bb7/packages/accounts-base/accounts_server.js#L499
 * - we obtain an object {userId, token}, user is now logged in
 * - token must be stored in Meteor.login_token localstorage
 * - it must be passed in the "meteor_login_token" cookie in the header or through the authorization header
 * - currentUser is injected into context for each request based on the token packages/vulcan-lib/lib/server/apollo-server/context.js
 *
// Acount js method names (inspired by meteor)
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
//  verifyAuthentication?: Maybe<Scalars['Boolean']>,
 */

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
 * Inspiration
 * @see https://github.com/stubailo/meteor-rest/blob/master/packages/rest-accounts-password/rest-login.js
 *
 * NOTE: this won't work with DDP. If you want to use usual DDP features (eg you develop an actual Meteor client),
 * use the usual Meteor connection pattern instead (see Meteor doc)
 *
 * @param {*} usernameOrEmail
 * @param {*} password
 */
export const authenticateWithPassword = async (email, password) => {
  // We reproduce the usual password auth strategy
  // Code taken from the loginHandler defined by accounts-password
  // @see https://github.com/meteor/meteor/blob/devel/packages/accounts-password/password_server.js#L282
  // To be done in the resolver
  //check(options, {
  //  user: userQueryValidator,
  //  password: passwordValidator
  //});
  const user = Accounts.findUserByEmail(email);
  if (!user) {
    // TODO: handle errors
    throw new Error('User not found');
  }
  if (!user.services || !user.services.password || !(user.services.password.bcrypt || user.services.password.srp)) {
    throw new Error('User has no password set');
  }
  const passwordCheck = Accounts._checkPassword(user, password);
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
    token: stampedLoginToken.token,
  };
};

/**
 * Invalidate user's auth token
 *
 * StampedToken = { when, token }
 * Method example:
 * @see https://github.com/meteor/meteor/blob/devel/packages/accounts-base/accounts_server.js#L523
 * Token destruction:
 * @see https://github.com/meteor/meteor/blob/devel/packages/accounts-base/accounts_server.js#L486
 */
export const logout = async userId => {
  // Note: we don't use this function directly because it is meant to keep some old style connection active
  // this means storing the token and it's creation, Meteor does this on the server, but we don't allow state in the server anymore
  // we could store it in the client but this is tedious...
  //
  // We have a more aggressive strategy in Vulcan and simply delete the list of tokens
  //
  //const hashedToken = Accounts._hashStampedToken(stampedToken);
  //await Accounts.destroyToken(userId, hasedToken);
  await Accounts.users.update(userId, {
    $set: {
      'services.resume.loginTokens': [],
    },
  });
  return { userId };
};

export const signup = async (email, password) => {
  if (Accounts._options.forbidClientAccountCreation) {
    throw new Error('Signups forbidden');
  }
  const options = { email, password };
  // Create user. result contains id and token.
  const userId = await Accounts.createUser(options);
  // safety belt. createUser is supposed to throw on error. send 500 error
  // instead of sending a verification email with empty userid.
  if (!userId) throw new Error('createUser failed to insert new user');

  // If `Accounts._options.sendVerificationEmail` is set, register
  // a token to verify the user's primary email, and send it to
  // that address.
  if (options.email && Accounts._options.sendVerificationEmail) Accounts.sendVerificationEmail(userId, options.email);
  // client gets logged in as the new user afterwards.
  return { userId: userId };
};

/**
 *  Set password for a connected user
 * /!\ WILL LOGOUT AND LOG IN AGAIN THE USER in order to invalidate previous token
 */
export const setPassword = async (userId, newPassword) => {
  await Accounts.setPassword(userId, newPassword);
  // logout active connexions
  console.log('logging out');
  await logout(userId);
  // relog in and return new token
  const user = await Meteor.users.findOne({ _id: userId });
  if (!(user.emails && user.emails.length)) {
    throw new Error("User email not found, couldn't authenticate after password change");
  }
  const email = user.emails[0].address;
  console.log('email', email);
  return await authenticateWithPassword(email, newPassword);
};

export const sendResetPasswordEmail = async email => {
  const user = await Accounts.findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }
  const userId = user._id;
  await Accounts.sendResetPasswordEmail(userId);
  return true;
};

// Utility for plucking addresses from emails
const pluckAddresses = (emails = []) => emails.map(email => email.address);
/**
 * For non connected user, need to parse the token
 * https://github.com/meteor/meteor/blob/devel/packages/accounts-password/password_server.js#L804
 * @param {*} userId
 * @param {*} newPassword
 */
export const resetPassword = async (token, newPassword) => {
  //check(token, String);
  //check(newPassword, passwordValidator);
  // Find the user with this token
  const user = await Meteor.users.findOne(
    { 'services.password.reset.token': token },
    {
      fields: {
        services: 1,
        emails: 1,
      },
    }
  );
  if (!user) {
    throw new Error('Token expired or invalid');
  }
  const userId = user._id;
  // check the token validity
  const { when, reason, email } = user.services.password.reset;
  let tokenLifetimeMs = Accounts._getPasswordResetTokenLifetimeMs();
  if (reason === 'enroll') {
    tokenLifetimeMs = Accounts._getPasswordEnrollTokenLifetimeMs();
  }
  const currentTimeMs = Date.now();
  if (currentTimeMs - when > tokenLifetimeMs) throw new Error('Token expired');
  if (!pluckAddresses(user.emails).includes(email))
    return {
      userId,
      error: new Error('Token has invalid email address'),
    };

  // Prepare rollback in case of failure
  // => this.connection is not defined
  // const oldToken = Accounts._getLoginToken(this.connection.id);
  // Accounts._setLoginToken(user._id, this.connection, null);
  // const resetToOldToken = () => Accounts._setLoginToken(user._id, this.connection, oldToken);

  // Meteor had a more complex logic here for some reason
  // we just reuse the setPassword logic
  //const hashed = hashPassword(newPassword);
  // NOTE: We're about to invalidate tokens on the user, who we might be
  // logged in as. Make sure to avoid logging ourselves out if this
  // happens. But also make sure not to leave the connection in a state
  // of having a bad token set if things fail.
  await setPassword(userId, newPassword);

  // Update the user record by:
  // - Changing the password to the new one => done by setPassword
  // - Forgetting about the reset token that was just used
  // - Verifying their email, since they got the password reset via email.
  try {
    const affectedRecords = await Meteor.users.update(
      {
        _id: userId,
        'emails.address': email,
        'services.password.reset.token': token,
      },
      //{$set: {'services.password.bcrypt': hashed,
      //        'emails.$.verified': true},
      {
        $unset: { 'services.password.reset': 1, 'services.password.srp': 1 },
      }
    );
    if (affectedRecords !== 1) {
      return {
        userId: userId,
        error: new Meteor.Error('Invalid email'),
      };
    }
  } catch (err) {
    // resetToOldToken();
    throw err;
  }

  // Replace all valid login tokens with new ones (changing
  // password should invalidate existing sessions).
  Accounts._clearAllLoginTokens(userId);

  return { userId: userId };
};

export const sendVerificationEmail = async email => {
  const user = await Accounts.findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }
  const userId = user._id;
  await Accounts.sendVerificationEmail(userId);
  return true;
};

/**
 * https://github.com/meteor/meteor/blob/devel/packages/accounts-password/password_server.js#L917
 * @param {*} email
 */
export const verifyEmail = async token => {
  const user = await Meteor.users.findOne(
    { 'services.email.verificationTokens.token': token },
    {
      fields: {
        services: 1,
        emails: 1,
      },
    }
  );
  if (!user) throw new Error('Verify email link expired or invalid');
  const userId = user._id;

  // check validity
  const tokenRecord = user.services.email.verificationTokens.find(t => t.token == token);
  if (!tokenRecord)
    return {
      userId: userId,
      error: new Error('Verify email link expired'),
    };

  // find user based on token email
  const emailsRecord = user.emails.find(e => e.address == tokenRecord.address);
  if (!emailsRecord) {
    return {
      userId: userId,
      error: new Error('Verify email link is for unknown address'),
    };
  }

  // By including the address in the query, we can use 'emails.$' in the
  // modifier to get a reference to the specific object in the emails
  // array. See
  // http://www.mongodb.org/display/DOCS/Updating/#Updating-The%24positionaloperator)
  // http://www.mongodb.org/display/DOCS/Updating#Updating-%24pull
  await Meteor.users.update(
    { _id: user._id, 'emails.address': tokenRecord.address },
    { $set: { 'emails.$.verified': true }, $pull: { 'services.email.verificationTokens': { address: tokenRecord.address } } }
  );

  return { userId: userId };
};
