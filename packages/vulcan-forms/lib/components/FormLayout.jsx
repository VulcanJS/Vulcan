import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent } from 'meteor/vulcan:core';

const FormLayout = ({ FormComponents, commonProps, formProps, errorProps, repeatErrors, submitProps, children }) => (
  <FormComponents.FormElement {...formProps}>
    <FormComponents.FormErrors {...commonProps} {...errorProps} />

    {children}

    {repeatErrors && <FormComponents.FormErrors {...commonProps} {...errorProps} />}

    <FormComponents.FormSubmit {...commonProps} {...submitProps} />
  </FormComponents.FormElement>
);

export default FormLayout;

registerComponent('FormLayout', FormLayout);
