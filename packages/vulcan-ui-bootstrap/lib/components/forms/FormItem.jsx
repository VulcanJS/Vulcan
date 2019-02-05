/*

Layout for a single form item

*/

import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { registerComponent } from 'meteor/vulcan:core';

const FormItem = ({ path, label, children, beforeInput, afterInput, ...rest }) => {
  if (label) {
    return (
      <Form.Group as={Row} controlId={path} {...rest}>
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
      <Form.Group controlId={path} {...rest}>
        {beforeInput}
        {children}
        {afterInput}
      </Form.Group>
    );
  }
};

registerComponent('FormItem', FormItem);
