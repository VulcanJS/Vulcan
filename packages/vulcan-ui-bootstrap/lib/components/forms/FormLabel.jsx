import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';
import Form from 'react-bootstrap/Form';

const FormLabel = ({ label: Label, layout }) => {
  const labelProps = layout === 'horizontal' ? { column: true, sm: 3 } : {};
  return (
    <Form.Label {...labelProps}>
      {typeof Label === 'function' ? <Label {...labelProps} /> : <span dangerouslySetInnerHTML={{ __html: Label }} />}
    </Form.Label>
  );
};

registerComponent('FormLabel', FormLabel);
