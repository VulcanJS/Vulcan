import { Components, registerComponent} from 'meteor/vulcan:core';
import React from 'react';

const SequencesSingle = (props, context) => {
  console.log("Sequences Single props", props);
  return <Components.SequencesPage documentId={props.params._id} />
};

SequencesSingle.displayName = "SequencesSingle";

registerComponent('SequencesSingle', SequencesSingle);
