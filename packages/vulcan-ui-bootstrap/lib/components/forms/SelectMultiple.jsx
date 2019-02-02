import React from 'react';
import { intlShape } from 'meteor/vulcan:i18n';
import Form from 'react-bootstrap/Form';
import { Components, registerComponent } from 'meteor/vulcan:core';

const SelectMultipleComponent = ({ refFunction, inputProperties, itemProperties }, { intl }) => {
  inputProperties.multiple = true;

  return (
    <Components.FormItem {...inputProperties} {...itemProperties}>
      <Form.Control as="select" {...inputProperties} ref={refFunction} />
    </Components.FormItem>
  );
};

SelectMultipleComponent.contextTypes = {
  intl: intlShape,
};

registerComponent('FormComponentSelectMultiple', SelectMultipleComponent);
