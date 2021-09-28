import React from 'react';
import Form from 'react-bootstrap/Form';
import { mergeWithComponents, registerComponent } from 'meteor/vulcan:core';

const getRange = (n = 10) => [...Array(n).keys()].map(i => i + 1).map(i => ({ value: i, label: i }));

const Likert = ({ refFunction, path, updateCurrentValues, inputProperties, itemProperties = {}, formComponents }) => {
  const Components = mergeWithComponents(formComponents);
  const { options = [], value } = inputProperties;
  const hasValue = value !== '';
  return (
    <Components.FormItem path={inputProperties.path} label={inputProperties.label} {...itemProperties}>
      <div className="likert-scale">
        <div className="likert-row">
          <div />
            {getRange().map((rating, i) => (
              <div key={i} className="likert-row-cell">
                {i+1}
              </div>
            ))}
        </div>
        {options.map((option, i) => {
          const optionPath = `${path}.${option.value}`;
          const optionValue = value && value[option.value];
          return (
            <div key={i} className="likert-row">
              <div className="likert-row-heading">{option.label}</div>
              {/* <div className="likert-row-contents"> */}
                {getRange().map((rating, i) => {
                  const isChecked = optionValue === rating.value;
                  const checkClass = hasValue ? (isChecked ? 'form-check-checked' : 'form-check-unchecked') : '';
                  return (
                    <div key={i} className="likert-row-cell">
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
                    </div>
                  );
                })}
              {/* </div> */}
            </div>
          );
        })}
      </div>
    </Components.FormItem>
  );
};

registerComponent('FormComponentLikert', Likert);
