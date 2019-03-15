import React from 'react';
import MuiSuggest from '../base-controls/MuiSuggest';
import MuiInput from '../base-controls/MuiInput';
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
    return <MuiSuggest {...properties} ref={refFunction} options={options} label={regionLabel}/>;
  } else {
    return <MuiInput {...properties} ref={refFunction} label={regionLabel}/>;
  }
};


registerComponent('RegionSelect', RegionSelect);
