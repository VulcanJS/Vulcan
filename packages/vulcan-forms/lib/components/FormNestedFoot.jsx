import React from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent } from 'meteor/vulcan:core';

const FormNestedFoot = ({ addItem }) => (
  <Components.Button size="small" variant="success" onClick={addItem} className="form-nested-button">
    <Components.IconAdd height={12} width={12} />
  </Components.Button>
);

FormNestedFoot.propTypes = {
  label: PropTypes.string,
  addItem: PropTypes.func,
};

registerComponent('FormNestedFoot', FormNestedFoot);
