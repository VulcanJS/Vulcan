import React from 'react';
import Form from 'react-bootstrap/Form';
import { mergeWithComponents, registerComponent } from 'meteor/vulcan:core';

const TextareaComponent = ({ refFunction, inputProperties = {}, itemProperties = {}, formComponents }) => {
  const Components = mergeWithComponents(formComponents);
  return (
  <Components.FormItem path={inputProperties.path} label={inputProperties.label} {...itemProperties}>
    <Form.Control as="textarea" ref={refFunction} {...inputProperties} />
  </Components.FormItem>
)};

registerComponent('FormComponentTextarea', TextareaComponent);
