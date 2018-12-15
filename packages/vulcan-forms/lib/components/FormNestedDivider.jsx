import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent } from 'meteor/vulcan:core';

const FormNestedDivider = ({ label, addItem }) => <div/>;

FormNestedDivider.propTypes = {
  label: PropTypes.string,
  addItem: PropTypes.func,
};

registerComponent('FormNestedDivider', FormNestedDivider);
