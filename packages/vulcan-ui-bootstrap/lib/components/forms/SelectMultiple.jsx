import React from 'react';
import { intlShape } from 'meteor/vulcan:i18n';
import Form from 'react-bootstrap/Form';
import { mergeWithComponents, registerComponent } from 'meteor/vulcan:core';

const SelectMultipleComponent = ({ refFunction, inputProperties, itemProperties, formComponents }, { intl }) => {
  inputProperties.multiple = true;
  const Components = mergeWithComponents(formComponents);
  return (
    <Components.FormItem path={inputProperties.path} label={inputProperties.label} {...itemProperties}>
      <Form.Control as="select" {...inputProperties} ref={refFunction} />
    </Components.FormItem>
  );
};

SelectMultipleComponent.contextTypes = {
  intl: intlShape,
};

registerComponent('FormComponentSelectMultiple', SelectMultipleComponent);
