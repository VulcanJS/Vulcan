import React from 'react';
import { Select } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const SelectComponent = ({refFunction, ...properties}) => <Select {...properties} ref={refFunction}/>

registerComponent('FormComponentSelect', SelectComponent);