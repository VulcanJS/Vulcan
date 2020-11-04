import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { registerComponent, mergeWithComponents } from 'meteor/vulcan:core';
import isEmpty from 'lodash/isEmpty';
import { isOtherValue, removeOtherMarker, addOtherMarker } from './Checkboxgroup.jsx';

const OtherComponent = ({ value, path, updateCurrentValues, formComponents }) => {
  const Components = mergeWithComponents(formComponents);
  const otherValue = removeOtherMarker(value);

  // keep track of whether "other" field is shown or not
  const [showOther, setShowOther] = useState(isOtherValue(value));

  // keep track of "other" field value locally
  const [textFieldValue, setTextFieldValue] = useState(otherValue);

  // whenever value changes (and is not empty), if it's not an "other" value
  // this means another option has been selected and we need to uncheck the "other" radio button
  useEffect(() => {
    if (value) {
      setShowOther(isOtherValue(value));
    }
  }, [value]);

  // textfield properties
  const textFieldInputProperties = {
    name: path,
    value: textFieldValue,
    onChange: event => {
      const fieldValue = event.target.value;
      // first, update local state
      setTextFieldValue(fieldValue);
      // then update global form state
      const newValue = isEmpty(fieldValue) ? null : addOtherMarker(fieldValue);
      updateCurrentValues({ [path]: newValue });
    },
  };
  const textFieldItemProperties = { layout: 'elementOnly' };

  return (
    <div className="form-option-other">
      <Form.Check
        name={path}
        layout="elementOnly"
        label={'Other'}
        value={showOther}
        checked={showOther}
        type="radio"
        onClick={event => {
          const isChecked = event.target.checked;
          // clear any previous values to uncheck all other checkboxes
          updateCurrentValues({ [path]: null });
          setShowOther(isChecked);
        }}
      />
      {showOther && <Components.FormComponentText inputProperties={textFieldInputProperties} itemProperties={textFieldItemProperties} />}
    </div>
  );
};

const RadioGroupComponent = ({
  refFunction,
  path,
  updateCurrentValues,
  inputProperties,
  itemProperties = {},
  formComponents,
}) => {
  const Components = mergeWithComponents(formComponents);
  const { options = [], value } = inputProperties;
  const hasValue = value !== '';
  return (
    <Components.FormItem path={inputProperties.path} label={inputProperties.label} {...itemProperties}>
      {options.map((option, i) => {
        const isChecked = value === option.value;
        const checkClass = hasValue ? (isChecked ? 'form-check-checked' : 'form-check-unchecked') : '';
        return (
          <Form.Check
            {...inputProperties}
            key={i}
            layout="elementOnly"
            type="radio"
            label={<Components.FormOptionLabel option={option} />}
            value={option.value}
            name={path}
            id={`${path}.${i}`}
            path={`${path}.${i}`}
            ref={refFunction}
            checked={isChecked}
            className={checkClass}
          />
        );
      })}
      {itemProperties.showOther && (
        <OtherComponent value={value} path={path} updateCurrentValues={updateCurrentValues} formComponents={formComponents} />
      )}
    </Components.FormItem>
  );
};

registerComponent('FormComponentRadioGroup', RadioGroupComponent);
