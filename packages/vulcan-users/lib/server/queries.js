import { addGraphQLResolvers, Connectors, addGraphQLQuery, addGraphQLSchema } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core isn't loaded yet
import { authenticateWithPassword, userSelectorSchema, logout } from './AuthPassword';

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
    userId: String
  }
  type LogoutResult {
    userId: String
  }
`);
addGraphQLQuery('authenticateWithPassword(input: AuthPasswordInput): AuthResult');
addGraphQLQuery('logout: LogoutResult');

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