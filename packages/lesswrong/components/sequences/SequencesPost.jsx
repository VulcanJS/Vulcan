import { Components, registerComponent , withDocument} from 'meteor/vulcan:core';
import Sequences from '../../lib/collections/sequences/collection.js';
import React from 'react';

const SequencesPost = (props, context) => {
  return <Components.PostsPage documentId={props.params.postId} sequenceId={props.params.sequenceId} />
};

const options = {
  collection: Sequences,
  queryName: "SequencesNavigationQuery",
  fragmentName: 'SequencesNavigationFragment',
  totalResolver: false,
}

registerComponent('SequencesPost', SequencesPost, withDocument(options));
