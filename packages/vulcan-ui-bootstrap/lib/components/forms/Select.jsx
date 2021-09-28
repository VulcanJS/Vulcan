import React from 'react';
import { intlShape } from 'meteor/vulcan:i18n';
import Form from 'react-bootstrap/Form';
import { mergeWithComponents, registerComponent } from 'meteor/vulcan:core';

// copied from vulcan:forms/utils.js to avoid extra dependency
const getFieldType = datatype => datatype && datatype[0].type;

const SelectComponent = ({ refFunction, inputProperties, itemProperties, datatype, options, formComponents }, { intl }) => {
  const Components = mergeWithComponents(formComponents);
  const noneOption = {
    label: intl.formatMessage({ id: 'forms.select_option' }),
    value: getFieldType(datatype) === String || getFieldType(datatype) === Number ? '' : null, // depending on field type, empty value can be '' or null
    disabled: true,
  };
  let otherOptions = Array.isArray(options) && options.length ? options : [];
  const allOptions = [noneOption, ...otherOptions];
  const { options: deleteOptions, ...newInputProperties } = inputProperties;
  return (
    <Components.FormItem path={inputProperties.path} label={inputProperties.label} {...itemProperties}>
      <Form.Control as="select" {...newInputProperties} ref={refFunction}>
        {allOptions.map(({ value, label, intlId, ...rest }) => (
          <option key={value} value={value} {...rest}>
            {label}
          </option>
        ))}
      </Form.Control>
    </Components.FormItem>
  );
};

SelectComponent.contextTypes = {
  intl: intlShape,
};

registerComponent('FormComponentSelect', SelectComponent);
