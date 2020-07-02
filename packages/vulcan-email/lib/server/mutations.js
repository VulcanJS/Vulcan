import Users from 'meteor/vulcan:users';
import { addGraphQLSchema, addGraphQLMutation, addGraphQLResolvers } from 'meteor/vulcan:lib';
import { VulcanEmail } from '../modules/index.js';

export const testEmail = async (root, { emailName }, context) => {
  if (Users.isAdmin(context.currentUser)) {
    const email = VulcanEmail.emails[emailName];
    const response = await VulcanEmail.buildAndSend({ emailName, variables: email.testVariables({}) });
    return response;
  } else {
    throw new Error({ id: 'app.noPermission' });
  }
};

const emailResponseSchema = `type EmailResponse {
  from: String
  to: String
  subject: String
  success: JSON
  error: String
}`;
addGraphQLSchema(emailResponseSchema);

addGraphQLMutation('testEmail(emailName: String) : EmailResponse');

const resolver = {
  Mutation: {
    testEmail,
  },
};

addGraphQLResolvers(resolver);
