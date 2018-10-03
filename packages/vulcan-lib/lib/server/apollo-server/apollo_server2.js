/**
 * @see https://www.apollographql.com/docs/apollo-server/whats-new.html
 * @see https://www.apollographql.com/docs/apollo-server/migration-two-dot.html
 */

// Migration:
// [ ] remove imports form graphql-tools everywhere
// [ ] engine: setup could be simplified
// [ ] switch to graphql playground
// [ ] update starter package
// [ ] test
// [ ] Meteor integration? Login?

import { makeExecutableSchema } from 'apollo-server';
import { ApolloServer } from 'apollo-server-express';

// now in apollo-server
//import { makeExecutableSchema } from 'graphql-tools';
import { Meteor } from 'meteor/meteor';
// import { Accounts } from 'meteor/accounts-base';

import { GraphQLSchema } from '../../modules/graphql.js';
import { WebApp } from 'meteor/webapp';

import { runCallbacks } from '../../modules/callbacks.js';
import cookiesMiddleware from 'universal-cookie-express';
// import Cookies from 'universal-cookie';

export let executableSchema;

import './settings';
import { engineConfig } from './engine';
import { defaultConfig, defaultOptions } from './defaults';
import computeContext from './computeContext';
import getGuiConfig from './gui';

// createApolloServer
const createApolloServer = ({ options: givenOptions = {}, config: givenConfig = {}, contextFromReq }) => {
  const graphiqlOptions = { ...defaultConfig.graphiqlOptions, ...givenConfig.graphiqlOptions };
  const config = { ...defaultConfig, ...givenConfig };
  config.graphiqlOptions = graphiqlOptions;

  //const app = express();
  // get the options and merge in defaults
  const options = { ...defaultOptions, ...givenOptions };
  // given options contains the schema
  const apolloServer = new ApolloServer({
    engine: engineConfig,
    ...options,
    // this replace the previous syntax graphqlExpress(async req => { ... })
    // this function takes the context, which contains the current request,
    // and setup the options accordingly ({req}) => { ...; return options }
    context: computeContext(options.context, contextFromReq)
  });

  // default function does nothing
  // TODO: what is the correct api with v2?
  config.configServer({ apolloServer });

  // setup middleware
  //// TODO: use a graphqlish solution?
  //app.use(cookiesMiddleware());
  //// TODO: is it needed?
  //app.use(compression());

  // connecte apollo with the Meteor app
  apolloServer.applyMiddleware({
    app: WebApp.connectHandlers,
    path: config.path,
    // graphql playground (replacement to graphiql), available on the app path
    gui: getGuiConfig(config)
  });

  // connect the meteor app with Express
  // @see http://www.mhurwi.com/meteor-with-express/
  //WebApp.connectHandlers.use(app);
  // setup the end point
  WebApp.connectHandlers.use(config.path, (req, res) => {
    if (req.method === 'GET') {
      res.end();
    }
  });
  // TODO: previous implementation with a patch. Is it still needed?
  //webAppConnectHandlersUse(Meteor.bindEnvironment(apolloServer), {
  //  name: 'graphQLServerMiddleware_bindEnvironment',
  //  order: 30
  //});
};

// createApolloServer when server startup
Meteor.startup(() => {
  runCallbacks('graphql.init.before');

  // typeDefs
  const generateTypeDefs = () => [
    `
scalar JSON
scalar Date

${GraphQLSchema.getAdditionalSchemas()}

${GraphQLSchema.getCollectionsSchemas()}

type Query {

${GraphQLSchema.queries
      .map(
        q =>
          `${
            q.description
              ? `  # ${q.description}
`
              : ''
          }  ${q.query}
  `
      )
      .join('\n')}
}

${
      GraphQLSchema.mutations.length > 0
        ? `type Mutation {

${GraphQLSchema.mutations
            .map(
              m =>
                `${
                  m.description
                    ? `  # ${m.description}
`
                    : ''
                }  ${m.mutation}
`
            )
            .join('\n')}
}
`
        : ''
    }
`
  ];

  const typeDefs = generateTypeDefs();

  GraphQLSchema.finalSchema = typeDefs;

  executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers: GraphQLSchema.resolvers,
    schemaDirectives: GraphQLSchema.directives
  });

  createApolloServer({
    options: {
      schema: executableSchema
    }
    // config: ....
    // contextFromReq: ....
  });
});
