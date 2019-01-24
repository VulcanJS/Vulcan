import React from 'react';
import { Form } from 'react-bootstrap';
import { Components, registerComponent } from 'meteor/vulcan:core';

const Default = ({ refFunction, inputProperties }) => (
  <Components.FormItem {...inputProperties}>
    <Form.Control {...inputProperties} ref={refFunction} type="text" />
  </Components.FormItem>
);

registerComponent('FormComponentDefault', Default);
registerComponent('FormComponentText', Default);
