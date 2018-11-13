import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent, Components } from 'meteor/vulcan:core';

const FieldErrors = ({ errors }) => (
  <ul className="form-input-errors">
    {errors.map((error, index) => (
      <li key={index}>
        <Components.FormError error={error} errorContext="field" />
      </li>
    ))}
  </ul>
);
FieldErrors.propTypes = {
  errors: PropTypes.array.isRequired
};
registerComponent('FieldErrors', FieldErrors);
