import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

const parseUrl = value => {
  return value && value.toString().slice(0, 4) === 'http' ? (
    <a href={value} target="_blank" rel="noopener noreferrer">
      {value}
    </a>
  ) : (
    value
  );
};

const StaticComponent = ({ inputProperties, itemProperties }) => (
  <Components.FormItem path={inputProperties.path} label={inputProperties.label} {...itemProperties}>
    <div>{parseUrl(inputProperties.value)}</div>
  </Components.FormItem>
);

registerComponent('FormComponentStaticText', StaticComponent);
