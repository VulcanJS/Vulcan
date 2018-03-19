import { VoteableCollections } from '../modules/make_voteable.js';
import { addToFragmentMatcher, addCallback } from 'meteor/vulcan:core';

function AddVoteableFragmentMatcher() {
  addToFragmentMatcher({
    kind: 'UNION',
    name: 'Voteable',
    possibleTypes: VoteableCollections.map(collection => ({name: collection.options.collectionName}))
  });
  return {};
}
addCallback('apolloclient.init.before', AddVoteableFragmentMatcher);
