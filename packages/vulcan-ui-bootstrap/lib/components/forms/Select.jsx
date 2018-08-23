import React from 'react';
import { intlShape } from 'meteor/vulcan:i18n';
import { Select } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

// copied from vulcan:forms/utils.js to avoid extra dependency
const getFieldType = datatype => datatype && datatype[0].type;

const SelectComponent = ({refFunction, inputProperties, datatype, ...properties}, { intl }) => {
  const noneOption = {
    label: intl.formatMessage({ id: 'forms.select_option' }),
    value: getFieldType(datatype) === String || getFieldType(datatype) === Number ? '' : null, // depending on field type, empty value can be '' or null
    disabled: true,
  };
  let otherOptions = Array.isArray(inputProperties.options) && inputProperties.options.length ? inputProperties.options : [];
  const options = [noneOption, ...otherOptions];
  return <Select {...inputProperties} options={options} ref={refFunction}/>
};

SelectComponent.contextTypes = {
  intl: intlShape,
};

registerComponent('FormComponentSelect', SelectComponent);
