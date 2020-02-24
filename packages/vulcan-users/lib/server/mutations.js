import { addGraphQLResolvers, addGraphQLMutation, addGraphQLSchema } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core isn't loaded yet
import { authenticateWithPassword, userSelectorSchema, logout } from './AuthPassword';

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
    userId: String
  }
  type LogoutResult {
    userId: String
  }
`);
addGraphQLMutation('authenticateWithPassword(input: AuthPasswordInput): AuthResult');
addGraphQLMutation('logout: LogoutResult');

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
            const { userSelector, password } = input;
            userSelectorSchema.validate(userSelector);
            if (!(password && typeof password === 'string')) {
                throw new Error('Invalid password');
            }
            return await authenticateWithPassword(input);
        },
        async logout(root, args, context) {
            if (!(context && context.userId)) {
                throw new Error('User already logged out');
            }
            const { userId } = context;
            return await logout(userId);

        }
    },
};

addGraphQLResolvers(specificResolvers);