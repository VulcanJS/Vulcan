import { Components, registerComponent} from 'meteor/vulcan:core';
import React from 'react';

const SequencesSingle = (props, context) => {
  return <Components.SequencesPage documentId={props.params._id} />
};

SequencesSingle.displayName = "SequencesSingle";

registerComponent('SequencesSingle', SequencesSingle);
