import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cookie from 'cookie';
import express from 'express';
import { makeExecutableSchema } from 'graphql-tools';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import deepmerge from 'deepmerge';
import OpticsAgent from 'optics-agent';
import DataLoader from 'dataloader';
import { formatError } from 'apollo-errors';

import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

import { GraphQLSchema } from '../modules/graphql.js';
import { Utils } from '../modules/utils.js';
import { webAppConnectHandlersUse } from './meteor_patch.js';

import { Collections } from '../modules/collections.js';
import findByIds from '../modules/findbyids.js';

// defaults
const defaultConfig = {
	path: '/graphql',
	maxAccountsCacheSizeInMB: 1,
	graphiql: Meteor.isDevelopment,
	graphiqlPath: '/graphiql',
	graphiqlOptions: {
		subscriptionsEndpoint: `ws://${Utils.getSiteDomain(true)}/subscriptions`,
		passHeader: "'Authorization': localStorage['Meteor.loginToken']", // eslint-disable-line quotes
	},
	configServer: graphQLServer => {},
};

const defaultOptions = {
	formatError: e => ({
		message: e.message,
		locations: e.locations,
		path: e.path,
	}),
};

if (Meteor.isDevelopment) {
	defaultOptions.debug = true;
}

const addUserToContext = async (contextContainer, token) => {
	if (token) {
		check(token, String);
		const hashedToken = Accounts._hashLoginToken(token);

		// Get the user from the database
		user = await Meteor.users.findOne({ 'services.resume.loginTokens.hashedToken': hashedToken });

		if (user) {
			const loginToken = Utils.findWhere(user.services.resume.loginTokens, { hashedToken });
			const expiresAt = Accounts._tokenExpiration(loginToken.when);
			const isExpired = expiresAt < new Date();

			if (!isExpired) {
				contextContainer.context.userId = user._id;
				contextContainer.context.currentUser = user;
			}
		}
	}
	return contextContainer;
};

const addDataloaderToContext = (contextContainer, Collection) => {
	Collections.forEach(collection => {
		contextContainer.context[collection.options.collectionName].loader = new DataLoader(ids => findByIds(collection, ids, contextContainer.context), { cache: true });
	});
	return contextContainer;
};

// createApolloServer
const createApolloServer = (givenOptions = {}, givenConfig = {}) => {
	const graphiqlOptions = { ...defaultConfig.graphiqlOptions, ...givenConfig.graphiqlOptions };
	const config = { ...defaultConfig, ...givenConfig };
	config.graphiqlOptions = graphiqlOptions;

	const graphQLServer = express();

	config.configServer(graphQLServer);

	// Use Optics middleware
	if (process.env.OPTICS_API_KEY) {
		graphQLServer.use(OpticsAgent.middleware());
	}

	// GraphQL endpoint
	graphQLServer.use(
		config.path,
		bodyParser.json(),
		graphqlExpress(async req => {
			let options;
			let user = null;

			if (typeof givenOptions === 'function') {
				options = givenOptions(req);
			} else {
				options = givenOptions;
			}

			// Merge in the defaults
			options = { ...defaultOptions, ...options };
			if (options.context) {
				// don't mutate the context provided in options
				options.context = { ...options.context };
			} else {
				options.context = {};
			}

			// Add Optics to GraphQL context object
			if (process.env.OPTICS_API_KEY) {
				options.context.opticsContext = OpticsAgent.context(req);
			}

			// Get the User from the header token
			options = await addUserToContext(options, req.headers.authorization);

			// merge with custom context
			options.context = deepmerge(options.context, GraphQLSchema.context);

			// go over context and add Dataloader to each collection
			options = addDataloaderToContext(options, Collections);

			// add error formatting from apollo-errors
			options.formatError = formatError;

			return options;
		}),
	);

	// Start GraphiQL if enabled
	if (config.graphiql) {
		graphQLServer.use(config.graphiqlPath, graphiqlExpress({ ...config.graphiqlOptions, endpointURL: config.path }));
	}

	// This binds the specified paths to the Express server running Apollo + GraphiQL
	webAppConnectHandlersUse(Meteor.bindEnvironment(graphQLServer), {
		name: 'graphQLServerMiddleware_bindEnvironment',
		order: 30,
	});

	new SubscriptionServer(
		{
			schema: givenOptions.schema,
			execute,
			subscribe,
			onOperation: async (message, params, webSocket) => {
				const token = cookie.parse(webSocket.upgradeReq.headers.cookie).meteor_login_token;
				// merge with custom context
				params.context = deepmerge(params.context, GraphQLSchema.context);
				// go over context and add Dataloader to each collection
				params = addDataloaderToContext(params, Collections);
				return await addUserToContext(params, token);
			},
		},
		{
			server: WebApp.httpServer,
			path: '/subscriptions',
		},
	);
};

// createApolloServer when server startup
Meteor.startup(() => {
	// typeDefs
	const generateTypeDefs = () => [
		`
    scalar JSON
    scalar Date

    ${GraphQLSchema.getCollectionsSchemas()}
    ${GraphQLSchema.getAdditionalSchemas()}

    enum _ModelMutationType {
      CREATED
      UPDATED
      DELETED
    }

    type Query {
      ${GraphQLSchema.queries.join('\n')}
    }

    ${GraphQLSchema.mutations.length > 0
			? `
    type Mutation {
      ${GraphQLSchema.mutations.join('\n')}
    }
    `
			: ''}

    ${GraphQLSchema.subscriptions.length > 0
			? `
    type Subscription {
      ${GraphQLSchema.subscriptions.join('\n')}
    }
    `
			: ''}

  `,
	];

	const typeDefs = generateTypeDefs();

	GraphQLSchema.finalSchema = typeDefs;

	const schema = makeExecutableSchema({
		typeDefs,
		resolvers: GraphQLSchema.resolvers,
	});

	if (process.env.OPTICS_API_KEY) {
		OpticsAgent.instrumentSchema(schema);
	}

	createApolloServer({
		schema,
	});
});
