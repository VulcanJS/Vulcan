import React from 'react';
import { intlShape } from 'meteor/vulcan:i18n';
import { Select } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const SelectMultipleComponent = ({refFunction, inputProperties, ...properties}, { intl }) => {
  inputProperties.multiple = true;
  
  return <Select {...inputProperties} ref={refFunction}/>
};

SelectMultipleComponent.contextTypes = {
  intl: intlShape,
};

registerComponent('FormComponentSelectMultiple', SelectMultipleComponent);
