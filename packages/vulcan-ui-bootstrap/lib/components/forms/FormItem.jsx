/*

Layout for a single form item

*/

import React from 'react';
import Form from 'react-bootstrap/lib/Form';
import { registerComponent } from 'meteor/vulcan:core';

const FormItem = ({ path, label, children }) => (
  <Form.Group controlId={path}>
    {label && <Form.Label>{label}</Form.Label>}
    {children}
  </Form.Group>
);

registerComponent('FormItem', FormItem);
