/**
 * Mutation for the user to manage its own account.
 *
 * Note: we don't have impersonating features yet, nor user enrollment or user email validation.
 */
import { addGraphQLResolvers, addGraphQLMutation, addGraphQLSchema } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core isn't loaded yet
import {
  authenticateWithPassword,
  logout,
  setPassword,
  sendResetPasswordEmail,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  signup,
} from './AuthPassword';

addGraphQLSchema(`
  input AuthPasswordInput {
    email: String
    password: String
  }
  type AuthResult {
    token: String
    userId: String
  }
  type LogoutResult {
    userId: String
  }

  input SignupInput {
    email: String
    password: String
  }
  type SignupResult {
    userId: String
  }

  input SetPasswordInput {
    newPassword: String
  }

  #type SetPasswordResult # Will auth user again so we reuse AuthResult atm

  input ResetPasswordInput {
    token: String
    newPassword: String
  }
  type ResetPasswordResult {
    userId: String
  }

  input VerifyEmailInput {
    token: String
  }
  type VerifyEmailResult {
    userId: String
  }

  input AuthEmailInput {
    email: String
  }
`);
addGraphQLMutation('authenticateWithPassword(input: AuthPasswordInput): AuthResult');
addGraphQLMutation('logout: LogoutResult');
addGraphQLMutation('signup(input: SignupInput): SignupResult');
addGraphQLMutation('setPassword(input: SetPasswordInput): AuthResult');
addGraphQLMutation('sendResetPasswordEmail(input: AuthEmailInput): Boolean');
addGraphQLMutation('resetPassword(input: ResetPasswordInput): ResetPasswordResult');
addGraphQLMutation('sendVerificationEmail(input: AuthEmailInput): Boolean');
addGraphQLMutation('verifyEmail(input: VerifyEmailInput): VerifyEmailResult');

const specificResolvers = {
  Mutation: {
    async authenticateWithPassword(root, args, context) {
      if (context && context.userId) {
        throw new Error('User already logged in');
      }
      const { input } = args;
      if (!input) {
        throw new Error('Empty input');
      }
      const { email, password } = input;
      if (!(password && typeof password === 'string')) {
        throw new Error('Invalid password');
      }
      if (!email) {
        throw new Error('Invalid email');
      }
      const authResult = await authenticateWithPassword(email, password);
      // set an HTTP-only cookie so the user is authenticated
      const { /*userId,*/ token } = authResult;
      const tokenCookie = {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development' ? false : true,
        // expires: //
        //sameSite: ''
      };
      context.req.res.cookie('meteor_login_token', token, tokenCookie);
      return authResult;
    },
    async logout(root, args, context) {
      if (!(context && context.userId)) {
        throw new Error('User already logged out');
      }
      const { userId } = context;
      context.req.res.clearCookie('meteor_login_token');
      return await logout(userId);
    },
    async signup(root, args, context) {
      if (context && context.userId) {
        throw new Error('User already logged in');
      }
      const { input } = args;
      const { email, password } = input;
      return await signup(email, password);
    },
    async setPassword(root, args, context) {
      if (!(context && context.userId)) {
        throw new Error('User not logged in');
      }
      const { userId } = context;
      const { input } = args;
      const { newPassword } = input;
      if (!newPassword) {
        throw new Error('Empty password');
      }
      return await setPassword(userId, newPassword);
    },
    async sendResetPasswordEmail(root, args, context) {
      if (context && context.userId) {
        throw new Error('User already logged in');
      }
      const { input } = args;
      const { email } = input;
      if (!email) {
        throw new Error('Empty email');
      }
      return await sendResetPasswordEmail(email);
    },
    async resetPassword(root, args, context) {
      if (context && context.userId) {
        throw new Error('User already logged in');
      }
      const { input } = args;
      const { token, newPassword } = input;
      if (!newPassword) {
        throw new Error('Empty password');
      }
      if (!token) {
        throw new Error('Empty token');
      }
      return await resetPassword(token, newPassword);
    },
    async sendVerificationEmail(root, args, context) {
      if (context && context.userId) {
        throw new Error('User already logged in');
      }
      const { input } = args;
      const { email } = input;
      if (!email) {
        throw new Error('Empty email');
      }
      return await sendVerificationEmail(email);
    },
    async verifyEmail(root, args, context) {
      if (context && context.userId) {
        throw new Error('User already logged in');
      }
      const { input } = args;
      const { token } = input;
      if (!token) {
        throw new Error('Empty token');
      }
      return await verifyEmail(token);
    },
  },
};

addGraphQLResolvers(specificResolvers);
