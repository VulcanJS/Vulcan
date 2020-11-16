import React from 'react';
import FormSuggest from '../base-controls/FormSuggest';
import { registerComponent } from 'meteor/vulcan:core';
import { countries } from './countries';


const CountrySelect = ({ refFunction, ...properties }) =>
  <FormSuggest {...properties} ref={refFunction} options={countries} limitToList={true}/>;


registerComponent('CountrySelect', CountrySelect);
