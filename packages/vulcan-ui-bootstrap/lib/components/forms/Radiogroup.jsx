import React from 'react';
import Form from 'react-bootstrap/Form';
import { Components, registerComponent } from 'meteor/vulcan:core';

const RadioGroupComponent = ({ refFunction, path, inputProperties, itemProperties }) => {
  const { options } = inputProperties;
  return (
    <Components.FormItem
      path={inputProperties.path}
      label={inputProperties.label}
      {...itemProperties}>
      {options.map((option, i) => (
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
        />
      ))}
    </Components.FormItem>
  );
};

registerComponent('FormComponentRadioGroup', RadioGroupComponent);
