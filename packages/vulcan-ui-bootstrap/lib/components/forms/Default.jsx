import React from 'react';
import Form from 'react-bootstrap/Form';
import { Components, registerComponent } from 'meteor/vulcan:core';

const Default = ({ refFunction, inputProperties, itemProperties }) => (
  <Components.FormItem {...inputProperties} {...itemProperties}>
    <Form.Control {...inputProperties} ref={refFunction} type="text" />
  </Components.FormItem>
);

registerComponent('FormComponentDefault', Default);
registerComponent('FormComponentText', Default);
