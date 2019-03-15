import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent } from 'meteor/vulcan:core';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';


const styles = theme => ({
  
  divider: {
    marginLeft: -24,
    marginRight: -24,
    marginTop: 16,
    marginBottom: 23,
  },
  
});


const FormNestedDivider = ({ classes, label, addItem }) => <Divider className={classes.divider}/>;

FormNestedDivider.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string,
  addItem: PropTypes.func,
};

registerComponent('FormNestedDivider', FormNestedDivider, [withStyles, styles]);
