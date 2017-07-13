import { addToGraphQLContext } from 'meteor/vulcan:lib';
import Users from '../modules.js';

addToGraphQLContext({ getViewableFields: Users.getViewableFields })
