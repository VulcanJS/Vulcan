import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const SelectComponent = properties => <Select {...properties}/>

registerComponent('FormComponentSelect', SelectComponent);