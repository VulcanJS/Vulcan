import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';
import Form from 'react-bootstrap/Form';

const FormLabel = ({ label, layout }) => {
  const labelProps = layout === 'horizontal' ? { column: true, sm: 3 } : {};
  return (
    <Form.Label {...labelProps}>
      <span dangerouslySetInnerHTML={{ __html: label }} />
    </Form.Label>
  );
};

registerComponent('FormLabel', FormLabel);
