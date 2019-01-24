import React from 'react';
import { Form } from 'react-bootstrap';
import { Components, registerComponent } from 'meteor/vulcan:core';

const CheckboxComponent = ({ refFunction, path, inputProperties }) => (
  <Components.FormItem {...inputProperties}>
    <Form.Check {...inputProperties} id={path} ref={refFunction} checked={!!inputProperties.value}/>
  </Components.FormItem>
);

registerComponent('FormComponentCheckbox', CheckboxComponent);
