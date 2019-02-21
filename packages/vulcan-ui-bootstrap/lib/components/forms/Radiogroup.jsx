import React from 'react';
import Form from 'react-bootstrap/Form';
import { Components, registerComponent } from 'meteor/vulcan:core';

const RadioGroupComponent = ({ refFunction, inputProperties, itemProperties }) => (
  <Components.FormItem path={inputProperties.path} label={inputProperties.label} {...itemProperties}>
    <Form.Check {...inputProperties} ref={refFunction} />
  </Components.FormItem>
);

registerComponent('FormComponentRadioGroup', RadioGroupComponent);
