import React from 'react';
import { Form } from 'react-bootstrap';
import { Components, registerComponent } from 'meteor/vulcan:core';

const EmailComponent = ({ refFunction, inputProperties }) => (
  <Components.FormItem {...inputProperties}>
    <Form.Control {...inputProperties} ref={refFunction} type="email" />
  </Components.FormItem>
);

registerComponent('FormComponentEmail', EmailComponent);
