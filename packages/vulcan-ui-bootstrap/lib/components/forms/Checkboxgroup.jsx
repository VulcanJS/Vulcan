import React from 'react';
import { Checkbox } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';
import without from 'lodash/without';
import uniq from 'lodash/uniq';
import intersection from 'lodash/intersection';

// note: treat checkbox group the same as a nested component, using `path`
const CheckboxGroupComponent = ({ refFunction, label, path, value, formType, updateCurrentValues, inputProperties }) => {

  const { options } = inputProperties;

  // get rid of duplicate values or any values that are not included in the options provided
  value = uniq(intersection(value, options.map(o => o.value)));

  // if this is a "new document" form check options' "checked" property to populate value
  if (formType === 'new' && value.length === 0) {
    const checkedValues = _.where(options, { checked: true }).map(option => option.value);
    if (checkedValues.length) {
      value = checkedValues;
    }
  }

  return (
    <div className="form-group row">
      <label className="control-label col-sm-3">{label}</label>
      <div className="col-sm-9">
        {options.map((option, i) => (
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
};

registerComponent('FormComponentCheckboxGroup', CheckboxGroupComponent);
