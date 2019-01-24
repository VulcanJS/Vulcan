import React from 'react';
import { Form } from 'react-bootstrap';
import { Components, registerComponent } from 'meteor/vulcan:core';

const UrlComponent = ({ refFunction, inputProperties, ...properties }) => (
  <Components.FormItem>
    <Form.Control ref={refFunction} {...inputProperties} type="url" />
  </Components.FormItem>
);

registerComponent('FormComponentUrl', UrlComponent);
