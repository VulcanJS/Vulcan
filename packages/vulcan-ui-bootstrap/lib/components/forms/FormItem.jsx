/*

Layout for a single form item

*/

import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { registerComponent, Components } from 'meteor/vulcan:core';

const FormItem = props => {

  const { path, label, children, beforeInput, afterInput, description, layout = 'horizontal', queryLoading, ...rest } = props;
  const innerComponent = queryLoading ? <Components.Loading/> : children;

  if (layout === 'inputOnly' || !label) {
    // input only layout
    return (
      <Form.Group controlId={path} {...rest}>
        {beforeInput}
        {innerComponent}
        {afterInput}
        {description && (
          <Form.Text>
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </Form.Text>
        )}
      </Form.Group>
    );
  } else if (layout === 'vertical') {
    // vertical layout
    return (
      <Form.Group controlId={path} {...rest}>
        <Form.Label>{label}</Form.Label>
        <div className="form-item-contents">
          <div className="form-item-input">
            {beforeInput}
            {innerComponent}
            {afterInput}
          </div>
          {description && (
            <Form.Text>
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </Form.Text>
          )}
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
          {innerComponent}
          {afterInput}
          {description && <Form.Text><div dangerouslySetInnerHTML={{__html: description}}/></Form.Text>}
        </Col>
      </Form.Group>
    );
  }
};

registerComponent('FormItem', FormItem);
