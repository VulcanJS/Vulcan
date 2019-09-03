/*

Layout for a single form item

*/

import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { registerComponent } from 'meteor/vulcan:core';

const FormItem = ({
  path,
  label,
  children,
  beforeInput,
  afterInput,
  layout = 'horizontal',
  ...rest
}) => {
  if (layout === 'inputOnly' || !label) {
    // input only layout
    return (
      <Form.Group controlId={path} {...rest}>
        {beforeInput}
        {children}
        {afterInput}
      </Form.Group>
    );
  } else if (layout === 'vertical') {
    // vertical layout
    return (
      <Form.Group controlId={path} {...rest}>
        <Form.Label>
          {label}
        </Form.Label>
        <div>
          {beforeInput}
          {children}
          {afterInput}
        </div>
      </Form.Group>
    );
  } else {
    // horizontal layout (default)
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
  }
};

registerComponent('FormItem', FormItem);
