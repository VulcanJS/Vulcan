import React from 'react';
import Form from 'react-bootstrap/Form';
import { mergeWithComponents, registerComponent } from 'meteor/vulcan:core';

const Default = ({ refFunction, inputProperties = {}, itemProperties = {}, formComponents }) => {
  const Components = mergeWithComponents(formComponents);
  return (
    <Components.FormItem path={inputProperties.path} label={inputProperties.label} {...itemProperties}>
      <Form.Control {...inputProperties} ref={refFunction} type="text" />
    </Components.FormItem>
  );
};

registerComponent('FormComponentDefault', Default);
registerComponent('FormComponentText', Default);
