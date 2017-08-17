import { Utils, pubsub, matchFilter } from 'meteor/vulcan:core';
import { withFilter } from 'graphql-subscriptions';
/*

Default subscriptions

*/

const subscribeFilter = (payload, variables) => {
	if (!payload) return false;
	return matchFilter(payload, variables.filter);
};

export const getDefaultSubscriptions = collectionName => ({
	// resolver for subscription with filtering and permission check

	default: {
		name: `${collectionName}`,

		subscription: {
			resolve: (payload, variables, context, info) => {
                const collection = context[collectionName];
                if (collection.checkAccess) {
                    Utils.performCheck(collection.checkAccess, context.currentUser, payload.node, collection, payload._id);
                }
                payload.node = context.Users.restrictViewableFields(context.currentUser, collection, payload.node);
				return payload;
			},
			subscribe: withFilter(() => pubsub.asyncIterator(Utils.camelCaseify(collectionName)), subscribeFilter)
		}
	}
});
