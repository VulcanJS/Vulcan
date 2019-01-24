import React from 'react';
import { Form } from 'react-bootstrap';
import { Components, registerComponent } from 'meteor/vulcan:core';

const NumberComponent = ({ refFunction, inputProperties }) => (
  <Components.FormItem {...inputProperties}>
    <Form.Control {...inputProperties} ref={refFunction} type="number" />
  </Components.FormItem>
);

registerComponent('FormComponentNumber', NumberComponent);
