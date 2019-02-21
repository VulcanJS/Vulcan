import React from 'react';
import Form from 'react-bootstrap/Form';
import { Components, registerComponent } from 'meteor/vulcan:core';

const CheckboxComponent = ({ refFunction, path, inputProperties, itemProperties }) => (
  <Components.FormItem path={inputProperties.path} label={inputProperties.label} {...itemProperties}>
    <Form.Check {...inputProperties} id={path} ref={refFunction} checked={!!inputProperties.value}/>
  </Components.FormItem>
);

registerComponent('FormComponentCheckbox', CheckboxComponent);
