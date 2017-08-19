import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const UrlComponent = properties => <Input {...properties} type="url" />

registerComponent('FormComponentUrl', UrlComponent);