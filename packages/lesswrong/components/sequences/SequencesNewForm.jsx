import { Components, registerComponent, getFragment, withMessages } from 'meteor/vulcan:core';
import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Sequences from '../../lib/collections/sequences/collection.js';

const SequencesNewForm = (props, context) => {
  return (
    <div className="sequences-new-form">
      <Components.SmartForm
        collection={Sequences}
        successCallback={(sequence) => {
          props.router.push({pathname: props.redirect || '/sequences/' + sequence._id });
          props.flash("successfully creates Sequence", "success");
        }}
        cancelCallback={props.cancelCallback}
        removeSuccessCallback={props.removeSuccessCallback}
        fragment={getFragment('SequencesPageFragment')}
        queryFragment={getFragment('SequencesPageFragment')}
        mutationFragment={getFragment('SequencesPageFragment')}
      />
    </div>
  )
}

registerComponent('SequencesNewForm', SequencesNewForm, withMessages, withRouter);
