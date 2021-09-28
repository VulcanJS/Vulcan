import React from 'react';
import Form from 'react-bootstrap/Form';
import { mergeWithComponents, registerComponent } from 'meteor/vulcan:core';

const UrlComponent = ({ refFunction, inputProperties, itemProperties, formComponents }) => {
  const Components = mergeWithComponents(formComponents);
  return (
  <Components.FormItem path={inputProperties.path} label={inputProperties.label} {...itemProperties}>
    <Form.Control ref={refFunction} {...inputProperties} type="url" />
  </Components.FormItem>
)};

registerComponent('FormComponentUrl', UrlComponent);
