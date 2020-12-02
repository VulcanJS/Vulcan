import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';
import Form from 'react-bootstrap/Form';

const FormDescription = ({ description }) => {
  return (
    <Form.Text>
      <div dangerouslySetInnerHTML={{ __html: description }} />
    </Form.Text>
  );
};

registerComponent('FormDescription', FormDescription);
