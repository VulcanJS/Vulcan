/**
 * Drop a collection if it already exists
 * before creating it
 * 
 * Thus this function can be replayed indefinitely
 * Note: this function is async contrary to createCollection
 * 
 * FIXME: does not work yet
 */
import {
    createCollection,
    getCollection
} from 'meteor/vulcan:core';

export default async (params) => {
    const ExistingColl = getCollection(params.collectionName);
    if (ExistingColl) {
        try {
            await ExistingColl.rawCollection().drop();
        } catch (err) {
            // if collection has been dropped already
            // mongo will return "ns not found"
            // can happen when tests are run in parallel
            if (err.codeName !== 'NamespaceNotFound') {
                throw err;
            }
        }
    }
    return createCollection(params);
};