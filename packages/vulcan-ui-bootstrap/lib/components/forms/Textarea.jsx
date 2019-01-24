import React from 'react';
import { Form } from 'react-bootstrap';
import { Components, registerComponent } from 'meteor/vulcan:core';

const TextareaComponent = ({ refFunction, inputProperties, ...properties }) => (
  <Components.FormItem {...inputProperties}>
    <Form.Control as="textarea" ref={refFunction} {...inputProperties} />
  </Components.FormItem>
);

registerComponent('FormComponentTextarea', TextareaComponent);
