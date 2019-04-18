import React from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent } from 'meteor/vulcan:core';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import Grid from '@material-ui/core/Grid';

const FormNestedFoot = ({ label, addItem }) => (
  <Grid container spacing={0} justify="flex-end">
    <Components.Button color="primary" iconButton onClick={addItem}>
      <Components.IconAdd/>
    </Components.Button>
  </Grid>
);

FormNestedFoot.propTypes = {
  label: PropTypes.string,
  addItem: PropTypes.func,
};

registerComponent('FormNestedFoot', FormNestedFoot);
