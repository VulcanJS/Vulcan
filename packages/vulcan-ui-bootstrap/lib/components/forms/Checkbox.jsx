import React from 'react';
import Form from 'react-bootstrap/Form';
import { mergeWithComponents, registerComponent } from 'meteor/vulcan:core';

const CheckboxComponent = ({ refFunction, path, inputProperties = {}, itemProperties = {}, formComponents }) => {
  const Components = mergeWithComponents(formComponents);
  return (
    <Components.FormItem path={inputProperties.path} label={inputProperties.label} {...itemProperties}>
      <Form.Check {...inputProperties} id={path} ref={refFunction} checked={!!inputProperties.value} />
    </Components.FormItem>
  );
};

registerComponent('FormComponentCheckbox', CheckboxComponent);
