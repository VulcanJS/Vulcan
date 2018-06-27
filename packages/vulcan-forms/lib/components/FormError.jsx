import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';
import { FormattedMessage } from 'meteor/vulcan:i18n';

const FormError = ({ error, context }) => error.message || (
  <FormattedMessage
    id={error.id}
    values={{
      context,
      ...error.data, // backwards compatibility
      ...error.properties,
    }}
    defaultMessage={JSON.stringify(error)}
  />
);

FormError.defaultProps = {
  context: '', // default context so format message does not complain
};

registerComponent('FormError', FormError);
