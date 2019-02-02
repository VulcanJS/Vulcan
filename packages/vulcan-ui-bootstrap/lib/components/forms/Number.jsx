import React from 'react';
import Form from 'react-bootstrap/Form';
import { Components, registerComponent } from 'meteor/vulcan:core';

const NumberComponent = ({ refFunction, inputProperties, itemProperties }) => (
  <Components.FormItem {...inputProperties} {...itemProperties}>
    <Form.Control {...inputProperties} ref={refFunction} type="number" />
  </Components.FormItem>
);

registerComponent('FormComponentNumber', NumberComponent);
