import React from 'react';
import Form from 'react-bootstrap/Form';
import { Components, registerComponent } from 'meteor/vulcan:core';

const getRange = (n = 10) => [...Array(n).keys()].map(i => i + 1).map(i => ({ value: i, label: i }));

const Likert = ({ refFunction, path, updateCurrentValues, inputProperties, itemProperties = {} }) => {
  const { options = [], value } = inputProperties;
  const hasValue = value !== '';
  return (
    <Components.FormItem path={inputProperties.path} label={inputProperties.label} {...itemProperties}>
      <div className="likert-scale">
        {options.map((option, i) => {
          console.log('// option');
          console.log(value);
          const optionPath = `${path}.${option.value}`;
          console.log(optionPath);
          const optionValue = value && value[option.value];
          console.log(optionValue);
          return (
            <div key={i} className="likert-row">
              <div className="likert-row-heading">{option.label}</div>
              <div className="likert-row-contents">
                {getRange().map((rating, i) => {
                  const isChecked = optionValue === rating.value;
                  const checkClass = hasValue ? (isChecked ? 'form-check-checked' : 'form-check-unchecked') : '';
                  return (
                    <Form.Check
                      {...inputProperties}
                      key={i}
                      layout="elementOnly"
                      type="radio"
                      label={rating.label}
                      value={rating.value}
                      name={optionPath}
                      id={optionPath}
                      path={optionPath}
                      ref={refFunction}
                      checked={isChecked}
                      className={checkClass}
                      onChange={() => {
                        updateCurrentValues({ [optionPath]: rating.value });
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Components.FormItem>
  );
};

registerComponent('FormComponentLikert', Likert);
