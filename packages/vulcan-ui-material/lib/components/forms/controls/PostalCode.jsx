import React from 'react';
import FormInput from '../base-controls/FormInput';
import { registerComponent } from 'meteor/vulcan:core';
import { getCountryInfo } from './RegionSelect';


const PostalCode = ({ classes, refFunction,  ...properties }) => {
  const currentCountryInfo = getCountryInfo(properties);
  const postalLabel = currentCountryInfo ? currentCountryInfo.postalLabel : 'Postal code';

  return <FormInput {...properties} ref={refFunction} label={postalLabel}/>;
};


registerComponent('PostalCode', PostalCode);
