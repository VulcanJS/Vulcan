import { addToGraphQLContext } from 'meteor/vulcan:lib';
import Users from '../modules/index.js';

addToGraphQLContext({ getViewableFields: Users.getViewableFields })
