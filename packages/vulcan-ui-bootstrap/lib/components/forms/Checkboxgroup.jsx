import React from 'react';
import { Checkbox } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

// note: treat checkbox group the same as a nested component, using `path`
const CheckboxGroupComponent = ({ refFunction, path, value, updateCurrentValues, inputProperties }) => (
  <div>
    {inputProperties.options.map((option, i) => (
      <Checkbox
        key={i}
        {...inputProperties}
        label={option.label}
        value={value.includes(option.value)}
        ref={refFunction}
        onChange={(name, isChecked) => {
          // give each individual checkbox its own path
          const checkboxPath = `${path}.${i}`;
          if (isChecked) {
            updateCurrentValues({ [checkboxPath]: option.value });
          } else {
            updateCurrentValues({ [checkboxPath]: null });
          }
        }}
      />
    ))}
  </div>
);

registerComponent('FormComponentCheckboxGroup', CheckboxGroupComponent);
