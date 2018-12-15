import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent } from 'meteor/vulcan:core';

const FormNestedHead = ({ label, addItem }) => (
  <label className="control-label col-sm-3">{label}</label>
);

FormNestedHead.propTypes = {
  label: PropTypes.string,
  addItem: PropTypes.func,
};

registerComponent('FormNestedHead', FormNestedHead);
