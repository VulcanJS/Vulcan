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
  let otherOptions = Array.isArray(inputProperties.options) && inputProperties.options.length ? inputProperties.options : [];
  // uncomment following to convert options values to strings
  // otherOptions = otherOptions.map(({ label, value }) => ({ label, value: value.toString()}));
  const options = [noneOption, ...otherOptions];
  return <Select {...inputProperties} options={options} ref={refFunction}/>
};

SelectComponent.contextTypes = {
  intl: intlShape,
};

registerComponent('FormComponentSelect', SelectComponent);
