import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const NumberComponent = properties => <Input {...properties} type="number" />

registerComponent('FormComponentNumber', NumberComponent);