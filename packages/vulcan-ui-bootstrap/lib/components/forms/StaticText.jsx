import React from 'react';
import { mergeWithComponents, registerComponent } from 'meteor/vulcan:core';

const parseUrl = value => {
  return value && value.toString().slice(0, 4) === 'http' ? (
    <a href={value} target="_blank" rel="noopener noreferrer">
      {value}
    </a>
  ) : (
    value
  );
};

const StaticComponent = ({ inputProperties, itemProperties, formComponents }) => {
  const Components = mergeWithComponents(formComponents);
  return (
  <Components.FormItem path={inputProperties.path} label={inputProperties.label} {...itemProperties}>
    <div style={{ paddingTop: 'calc(.375rem + 1px)', paddingBottom: 'calc(.375rem + 1px)' }}>{parseUrl(inputProperties.value)}</div>
  </Components.FormItem>
)};

registerComponent('FormComponentStaticText', StaticComponent);
