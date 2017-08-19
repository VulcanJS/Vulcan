import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const EmailComponent = properties => <Input {...properties} type="email" />

registerComponent('FormComponentEmail', EmailComponent);