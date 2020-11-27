import React from 'react';
import FormSuggest from '../base-controls/FormSuggest';
import FormInput from '../base-controls/FormInput';
import { registerComponent } from 'meteor/vulcan:core';
import { countryInfo } from './countries';
import _get from 'lodash/get';


export const getCountryInfo = function (formComponentProps) {
  const addressPath = formComponentProps.path;
  const countryParts = addressPath.split('.');
  countryParts[countryParts.length-1] = 'country';
  const country = _get(formComponentProps.document, countryParts);
  return country && countryInfo[country];
};


const RegionSelect = ({ classes, refFunction, ...properties }) => {
  const currentCountryInfo = getCountryInfo(properties);
  const options = currentCountryInfo ? currentCountryInfo.regions : null;
  const regionLabel = currentCountryInfo ? currentCountryInfo.regionLabel : 'Region';

  if (options) {
    return <FormSuggest {...properties} ref={refFunction} options={options} label={regionLabel}/>;
  } else {
    return <FormInput {...properties} ref={refFunction} label={regionLabel}/>;
  }
};


registerComponent('RegionSelect', RegionSelect);
