import { GraphQLSchema } from 'meteor/nova:lib';
import Users from '../modules.js';

GraphQLSchema.addToContext({ getViewableFields: Users.getViewableFields })
