import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const Default = ({refFunction, ...properties}) => <Input {...properties} ref={refFunction} type="text" />

registerComponent('FormComponentDefault', Default);