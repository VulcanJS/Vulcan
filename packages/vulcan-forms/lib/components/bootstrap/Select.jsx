import React from 'react';
import { Select } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const SelectComponent = ({refFunction, inputProperties, ...properties}) => <Select {...inputProperties} ref={refFunction}/>

registerComponent('FormComponentSelect', SelectComponent);