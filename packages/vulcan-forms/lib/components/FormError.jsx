import React from 'react';
import PropTypes from 'prop-types';
import getContext from 'recompose/getContext';
import { registerComponent } from 'meteor/vulcan:core';
import { FormattedMessage } from 'meteor/vulcan:i18n';

const FormError = ({ error, errorContext, getLabel }) => {
  // if we explictely provide a message
  if (error.message) {
    return error.message;
  }
  // default props for all errors
  let messageProps = {
    id: error.id,
    defaultMessage:JSON.stringify(error),
    values:{
      errorContext
    }
  };
  // additional properties to enhance the message
  if (error.properties) {
    // in case this is a nested fields, only keep last segment of path
    const errorName = error.properties.name && error.properties.name.split('.').slice(-1)[0];
    messageProps.values = {
      ...messageProps.values,
      // if the error is triggered by a field, get the relevant label
      label: errorName && getLabel(errorName, error.properties.locale),
      ...error.properties,
    };
  }
  if (error.data){
    messageProps.values={
      ...messageProps.values,
      ...error.data, // backwards compatibility
    };
  }
  return (
    <FormattedMessage
      {...messageProps}
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
