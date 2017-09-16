import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const EmailComponent = ({refFunction, ...properties}) => <Input {...properties} ref={refFunction} type="email" />

registerComponent('FormComponentEmail', EmailComponent);