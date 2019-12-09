import React from 'react';
import Form from 'react-bootstrap/Form';
import { Components, registerComponent } from 'meteor/vulcan:core';

const RadioGroupComponent = ({ refFunction, path, inputProperties, itemProperties }) => {
  const { options = [], value } = inputProperties;
  const hasValue = value !== '';
  return (
    <Components.FormItem
      path={inputProperties.path}
      label={inputProperties.label}
      {...itemProperties}>
      {options.map((option, i) => {
        const isChecked = value === option.value;
        const checkClass = hasValue ? isChecked ? 'form-check-checked' : 'form-check-unchecked' : '';
        return (
          <Form.Check
            {...inputProperties}
            key={i}
            layout="elementOnly"
            type="radio"
            label={option.label}
            value={option.value}
            name={path}
            id={`${path}.${i}`}
            path={`${path}.${i}`}
            ref={refFunction}
            checked={isChecked}
            className={checkClass}
          />
        );})}
    </Components.FormItem>
  );
};

registerComponent('FormComponentRadioGroup', RadioGroupComponent);
