import React from 'react';
import { Checkbox } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';
import without from 'lodash/without';

// note: treat checkbox group the same as a nested component, using `path`
const CheckboxGroupComponent = ({ refFunction, label, path, value, updateCurrentValues, inputProperties }) => (
  <div className="form-group row">
    <label className="control-label col-sm-3">{label}</label>
    <div className="col-sm-9">
    {inputProperties.options.map((option, i) => (
      <Checkbox
        layout="elementOnly"
        key={i}
        {...inputProperties}
        label={option.label}
        value={value.includes(option.value)}
        ref={refFunction}
        onChange={(name, isChecked) => {
          const newValue = isChecked ? [...value, option.value] : without(value, option.value);
          updateCurrentValues({ [path]: newValue });
        }}
      />
    ))}
    </div>
  </div>
);

registerComponent('FormComponentCheckboxGroup', CheckboxGroupComponent);
