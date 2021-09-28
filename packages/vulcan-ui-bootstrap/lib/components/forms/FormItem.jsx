/*

Layout for a single form item

*/

import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { registerComponent, mergeWithComponents } from 'meteor/vulcan:core';

const FormItem = props => {
  const {
    path,
    label,
    children,
    beforeInput,
    afterInput,
    description,
    layout = 'horizontal',
    loading,
    Components: formComponents,
    ...rest
  } = props;

  const Components = mergeWithComponents(formComponents);

  const innerComponent = loading ? <Components.FormInputLoading loading={loading}>{children}</Components.FormInputLoading> : children;

  if (layout === 'inputOnly' || !label) {
    // input only layout
    return (
      <Form.Group controlId={path}>
        {beforeInput}
        {innerComponent}
        {afterInput}
        {description && <Components.FormDescription {...props} />}
      </Form.Group>
    );
  } else if (layout === 'vertical') {
    // vertical layout
    return (
      <Form.Group controlId={path}>
        <Components.FormLabel {...props} />
        <div className="form-item-contents">
          <div className="form-item-input">
            {beforeInput}
            {innerComponent}
            {afterInput}
          </div>
          {description && <Components.FormDescription {...props} />}
        </div>
      </Form.Group>
    );
  } else {
    // horizontal layout (default)
    return (
      <Form.Group as={Row} controlId={path}>
        <Components.FormLabel layout="horizontal" {...props} />
        <Col sm={9}>
          {beforeInput}
          {innerComponent}
          {afterInput}
          {description && <Components.FormDescription {...props} />}
        </Col>
      </Form.Group>
    );
  }
};

registerComponent('FormItem', FormItem);
