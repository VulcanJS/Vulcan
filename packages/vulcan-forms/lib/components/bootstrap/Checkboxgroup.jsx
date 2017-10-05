import React from 'react';
import PropTypes from 'prop-types';
import { CheckboxGroup } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const CheckboxGroupComponent = ({refFunction, ...properties}) => <CheckboxGroup {...properties} ref={refFunction} />

registerComponent('FormComponentCheckboxGroup', CheckboxGroupComponent);