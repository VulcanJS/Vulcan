/*

Layout for a single form item

*/

import React from 'react';
import Form from 'react-bootstrap/lib/Form';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { registerComponent } from 'meteor/vulcan:core';

const FormItem = ({ path, label, children, beforeInput, afterInput }) => {
  if (label) {
    return (
      <Form.Group as={Row} controlId={path}>
        <Form.Label column sm={3}>
          {label}
        </Form.Label>
        <Col sm={9}>
          {beforeInput}
          {children}
          {afterInput}
        </Col>
      </Form.Group>
    );
  } else {
    return (
      <Form.Group controlId={path}>
        {beforeInput}
        {children}
        {afterInput}
      </Form.Group>
    );
  }
};

registerComponent('FormItem', FormItem);
