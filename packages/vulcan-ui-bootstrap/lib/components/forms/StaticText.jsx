import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';

const parseUrl = value => {
  return value && value.toString().slice(0,4) === 'http' ? <a href={value} target="_blank">{value}</a> : value;
}

const StaticComponent = ({ value, label }) => (
  <div className="form-group row">
    <label className="control-label col-sm-3">{label}</label>
    <div className="col-sm-9">{parseUrl(value)}</div>
  </div>
);

registerComponent('FormComponentStaticText', StaticComponent);
