/**
 * Init tests that require a valid schema, like testing Apollo SSR
 */
import { GraphQLSchema, addGraphQLSchema } from 'meteor/vulcan:lib/lib/modules/graphql';
import initGraphQL from 'meteor/vulcan:lib/lib/server/apollo-server/initGraphQL';
const initGraphQLTest = () => {
    GraphQLSchema.init();
    // schema must never be empty
    addGraphQLSchema(`
    type Query {
            currentUser: JSON
            SiteData: JSON
        }
        `);
    initGraphQL();
};

export default initGraphQLTest;