import { addGraphQLResolvers } from 'meteor/vulcan:core';
import { Meteor } from 'meteor/meteor';
import loginWithPassword from './loginWithPassword';
import logout from './logout';
import changePassword from './changePassword';
import createUser from './createUser';
import verifyEmail from './verifyEmail';
import resendVerificationEmail from './resendVerificationEmail';
import forgotPassword from './forgotPassword';
import resetPassword from './resetPassword';
import oauth from './oauth';
import hasService from './oauth/hasService';

const options = {
  CreateUserProfileInput: 'name: String',
  loginWithFacebook: false,
  loginWithGoogle: false,
  loginWithLinkedIn: false,
  loginWithPassword: true,
};

const loginMethodResponseResolver = {
  LoginMethodResponse: {
    user({ id }) {
      return Meteor.users.findOne(id);
    },
  },
};

const mutationResolvers = {
  logout,
  verifyEmail,
  resendVerificationEmail,
  ...oauth(options),
};

if (hasService(options, 'password')) {
  mutationResolvers.loginWithPassword = loginWithPassword;
  mutationResolvers.changePassword = changePassword;
  mutationResolvers.createUser = createUser;
  mutationResolvers.forgotPassword = forgotPassword;
  mutationResolvers.resetPassword = resetPassword;
}

const resolvers = { Mutation: mutationResolvers, ...loginMethodResponseResolver };

addGraphQLResolvers(resolvers);
