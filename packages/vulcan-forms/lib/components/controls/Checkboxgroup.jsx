import React from 'react';
import PropTypes from 'prop-types';
import { CheckboxGroup } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const CheckboxGroupComponent = properties => <CheckboxGroup {...properties} />

registerComponent('FormComponentCheckboxGroup', CheckboxGroupComponent);