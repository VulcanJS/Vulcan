import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { registerComponent, mergeWithComponents } from 'meteor/vulcan:core';
import without from 'lodash/without';
import uniq from 'lodash/uniq';
import isEmpty from 'lodash/isEmpty';

// this marker is used to identify "other" values
export const otherMarker = '[other]';

// check if a string is an "other" value
export const isOtherValue = s => s && typeof s === 'string' && s.substr(0, otherMarker.length) === otherMarker;

// remove the "other" marker from a string
export const removeOtherMarker = s => s && typeof s === 'string' && s.substr(otherMarker.length);

// add the "other" marker to a string
export const addOtherMarker = s => `${otherMarker}${s}`;

// return array of values without the "other" value
export const removeOtherValue = a => {
  return a.filter(s => !isOtherValue(s));
};

const OtherComponent = ({ value, path, updateCurrentValues, formComponents }) => {
  const Components = mergeWithComponents(formComponents);

  const otherValue = removeOtherMarker(value.find(isOtherValue));
  // get copy of checkbox group values with "other" value removed
  const withoutOtherValue = removeOtherValue(value);

  // keep track of whether "other" field is shown or not
  const [showOther, setShowOther] = useState(!!otherValue);

  // keep track of "other" field value locally
  const [textFieldValue, setTextFieldValue] = useState(otherValue);

  // textfield properties
  const textFieldInputProperties = {
    name,
    value: textFieldValue,
    onChange: event => {
      const fieldValue = event.target.value;
      // first, update local state
      setTextFieldValue(fieldValue);
      // then update global form state
      const newValue = isEmpty(fieldValue) ? withoutOtherValue : [...withoutOtherValue, addOtherMarker(fieldValue)];
      updateCurrentValues({ [path]: newValue });
    },
  };
  const textFieldItemProperties = { layout: 'elementOnly' };

  return (
    <div className="form-option-other">
      <Form.Check
        layout="elementOnly"
        label={'Other'}
        value={showOther}
        checked={showOther}
        onClick={event => {
          const isChecked = event.target.checked;
          setShowOther(isChecked);
          if (isChecked) {
            // if checkbox is checked and textfield has value, update global form state with current textfield value
            if (textFieldValue) {
              updateCurrentValues({ [path]: [...withoutOtherValue, addOtherMarker(textFieldValue)] });
            }
          } else {
            // if checkbox is unchecked, also clear out field value from global form state
            updateCurrentValues({ [path]: withoutOtherValue });
          }
        }}
      />
      {showOther && <Components.FormComponentText inputProperties={textFieldInputProperties} itemProperties={textFieldItemProperties} />}
    </div>
  );
};

// note: treat checkbox group the same as a nested component, using `path`
const CheckboxGroupComponent = ({
  refFunction,
  label,
  path,
  value,
  formType,
  disabled,
  updateCurrentValues,
  inputProperties,
  itemProperties = {},
  formComponents,
}) => {
  const Components = mergeWithComponents(formComponents);

  const { options = [], name } = inputProperties;

  // get rid of duplicate values; or any values that are not included in the options provided
  // (unless they have the "other" marker)
  value = value ? uniq(value.filter(v => isOtherValue(v) || options.map(o => o.value).includes(v))) : [];

  const hasValue = value.length > 0;

  // if this is a "new document" form check options' "checked" property to populate value
  if (formType === 'new' && value.length === 0) {
    const checkedValues = _.where(options, { checked: true }).map(option => option.value);
    if (checkedValues.length) {
      value = checkedValues;
    }
  }

  return (
    <Components.FormItem path={path} label={label} {...itemProperties}>
      <div className="form-item-options">
        {options.map((option, i) => {
          const isChecked = value.includes(option.value);
          const checkClass = hasValue ? (isChecked ? 'form-check-checked' : 'form-check-unchecked') : '';
          return (
            <Form.Check
              {...inputProperties}
              name={name}
              layout="elementOnly"
              key={i}
              label={<Components.FormOptionLabel option={option} name={name} />}
              value={isChecked}
              checked={isChecked}
              id={`${path}.${i}`}
              path={`${path}.${i}`}
              ref={refFunction}
              onChange={event => {
                const isChecked = event.target.checked;
                const newValue = isChecked ? [...value, option.value] : without(value, option.value);
                updateCurrentValues({ [path]: newValue });
              }}
              className={checkClass}
            />
          );
        })}
        {itemProperties.showOther && (
          <OtherComponent value={value} path={path} updateCurrentValues={updateCurrentValues} formComponents={formComponents} />
        )}
      </div>
    </Components.FormItem>
  );
};

registerComponent('FormComponentCheckboxGroup', CheckboxGroupComponent);
