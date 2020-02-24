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
        optional: true
    }
});
userSelectorSchema.addDocValidator((userSelector) => {
    if (!userSelector) return [{ name: 'userSelector', type: 'MUST_HAVE_USER_SELECTOR' }];
    const { email, username } = userSelector;
    if (!(email || username)) return [{ name: 'userSelector', type: 'MUST_HAVE_USERNAME_OR_EMAIL' }];
    return [];
});


/**
 * How Meteor auth works:
 * 
 * - accounts-password will register a login handler with all auth logic it needs: https://github.com/meteor/meteor/blob/devel/packages/accounts-password/password_server.js#L350
 * - accounts-base will define a "login" method that runs all handlers on data: https://github.com/meteor/meteor/blob/d612d7546fa446cd574b51c0ea7953253f5e4bb7/packages/accounts-base/accounts_server.js#L499
 * - we obtain an object {userId, token}, user is now logged in
 * - token must be stored in Meteor.login_token localstorage
 * - it must be passed in the "meteor_login_token" cookie in the header or through the authorization header
 * - currentUser is injected into context for each request based on the token packages/vulcan-lib/lib/server/apollo-server/context.js
 * 
 * Logout and token:
 * 
 */

// Acount js method names:
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
export const authenticateWithPassword = async (options) => {
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
        password
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
export const logout = async (userId) => {
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
            'services.resume.loginTokens': []
        }
    });
    return { userId };
};