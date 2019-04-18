import React from 'react';
import MuiInput from '../base-controls/MuiInput';
import { registerComponent } from 'meteor/vulcan:core';
import { getCountryInfo } from './RegionSelect';


const PostalCode = ({ classes, refFunction, inputProperties, ...properties }) => {
  const currentCountryInfo = getCountryInfo(properties);
  const postalLabel = currentCountryInfo ? currentCountryInfo.postalLabel : 'Postal code';
  
  return <MuiInput {...inputProperties} ref={refFunction} label={postalLabel}/>;
};


registerComponent('PostalCode', PostalCode);
