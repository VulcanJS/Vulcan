import React from 'react';
import PropTypes from 'prop-types';
import { replaceComponent } from 'meteor/vulcan:core';
import { FormattedMessage } from 'meteor/vulcan:i18n';

const FormNestedHead = ({ label, addItem }) => <span/>;

FormNestedHead.propTypes = {
  label: PropTypes.string,
  addItem: PropTypes.func,
};

replaceComponent('FormNestedHead', FormNestedHead);
