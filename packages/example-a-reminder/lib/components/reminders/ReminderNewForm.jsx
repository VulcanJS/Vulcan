import React, { PropTypes, Component } from 'react';
import Movies from '../../modules/reminders/collection.js';
import { Components, registerComponent, withMessages, } from 'meteor/vulcan:core';

const RemindersNewForm = props =>
  <Components.SmartForm
    collection={Reminders}
    successCallback={document => {
      props.closeModal();
    }}
  />

registerComponent('RemindersNewForm', RemindersNewForm, withMessages);
