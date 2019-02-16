import React from 'react';
import Form from 'react-bootstrap/Form';
import { Components, registerComponent } from 'meteor/vulcan:core';
import without from 'lodash/without';
import uniq from 'lodash/uniq';
import intersection from 'lodash/intersection';

// note: treat checkbox group the same as a nested component, using `path`
const CheckboxGroupComponent = ({ refFunction, label, path, value, formType, updateCurrentValues, inputProperties, itemProperties }) => {

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

  // note: get rid of the default onChange inherited from FormComponent
  const { onChange, ...newInputProperties } = inputProperties; // eslint-disable-line no-unused-vars

  return (
    <Components.FormItem {...newInputProperties} {...itemProperties}>
      <div>
        {options.map((option, i) => (
          <Form.Check
            layout="elementOnly"
            key={i}
            {...newInputProperties}
            label={option.label}
            value={value.includes(option.value)}
            checked={!!value.includes(option.value)}
            id={`${path}.${i}`}
            path={`${path}.${i}`}
            ref={refFunction}
            onChange={event => {
              const isChecked = event.target.checked;
              const newValue = isChecked ? [...value, option.value] : without(value, option.value);
              updateCurrentValues({ [path]: newValue });
            }}
          />
        ))}
      </div>
    </Components.FormItem>
  );
};

registerComponent('FormComponentCheckboxGroup', CheckboxGroupComponent);
