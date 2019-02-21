import React from 'react';
import PropTypes from 'prop-types';
import getContext from 'recompose/getContext';
import { registerComponent } from 'meteor/vulcan:core';
import { FormattedMessage } from 'meteor/vulcan:i18n';

const FormError = ({ error, errorContext, getLabel }) => {
  if (error.message) {
    return error.message;
  }
  // in case this is a nested fields, only keep last segment of path
  const errorName = error.properties.name.split('.').slice(-1)[0];
  return (
    <FormattedMessage
      id={error.id}
      values={{
        errorContext,
        label: error.properties && getLabel(errorName, error.properties.locale),
        ...error.data, // backwards compatibility
        ...error.properties,
      }}
      defaultMessage={JSON.stringify(error)}
    />
  )
;};

FormError.defaultProps = {
  errorContext: '', // default context so format message does not complain
  getLabel: name => name,
};

// TODO: pass getLabel as prop instead for consistency?
registerComponent('FormError', FormError, getContext({
  getLabel: PropTypes.func,
}));
