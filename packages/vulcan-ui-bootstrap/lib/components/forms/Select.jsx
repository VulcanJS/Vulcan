import React from 'react';
import { intlShape } from 'meteor/vulcan:i18n';
import { Select } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const SelectComponent = ({refFunction, inputProperties, ...properties}, { intl }) => {
  const noneOption = {
    label: intl.formatMessage({ id: 'forms.select_option' }),
    value: '',
    disabled: true,
  };
  inputProperties.options = [noneOption, ...inputProperties.options];
  
  return <Select {...inputProperties} ref={refFunction}/>
};

SelectComponent.contextTypes = {
  intl: intlShape,
};

registerComponent('FormComponentSelect', SelectComponent);
