import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent } from 'meteor/vulcan:core';
import { FormattedMessage } from 'meteor/vulcan:i18n';

const FieldErrors = ({ errors }) => (
  <ul className="form-input-errors">
    {errors.map((error, index) => (
      <li key={index}>
        {error.message || (
          <FormattedMessage
            id={`errors.${error.data.type}`}
            values={{ ...error.data }}
            defaultMessage={JSON.stringify(error)}
          />
        )}
      </li>
    ))}
  </ul>
);
registerComponent('FieldErrors', FieldErrors);
