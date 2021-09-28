import React from 'react';
import Form from 'react-bootstrap/Form';
import { mergeWithComponents, registerComponent } from 'meteor/vulcan:core';

const NumberComponent = ({ refFunction, inputProperties, itemProperties, formComponents }) => {
  const Components = mergeWithComponents(formComponents);
  return (
    <Components.FormItem path={inputProperties.path} label={inputProperties.label} {...itemProperties}>
      <Form.Control {...inputProperties} ref={refFunction} type="number" />
    </Components.FormItem>
  );
};

registerComponent('FormComponentNumber', NumberComponent);
