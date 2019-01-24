/*

Layout for a single form item

*/

import React from 'react';
import { Form } from 'react-bootstrap';
import { registerComponent } from 'meteor/vulcan:core';

const FormItem = ({ path, label, children }) => (
  <Form.Group controlId={path}>
    <Form.Label>{label}</Form.Label>
    {children}
  </Form.Group>
);

registerComponent('FormItem', FormItem);
