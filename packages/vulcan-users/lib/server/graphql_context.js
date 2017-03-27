import { GraphQLSchema } from 'meteor/vulcan:lib';
import Users from '../modules.js';

GraphQLSchema.addToContext({ getViewableFields: Users.getViewableFields })
