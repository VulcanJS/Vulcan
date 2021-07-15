import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent } from 'meteor/vulcan:lib';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';


export const styles = theme => ({

  root: {
    marginLeft: 4,
  },

  missing: {
    color: theme.palette.error.main,
  },

});


const RequiredIndicator = (props) => {
  const { classes, optional, value } = props;
  const className = classNames('required-indicator', 'optional-symbol', classes.root, !value && classes.missing);

  return optional
    ?
    null
    :
    <span className={className}>*</span>;
};


RequiredIndicator.propTypes = {
  classes: PropTypes.object.isRequired,
  optional: PropTypes.bool,
  value: PropTypes.any,
};


registerComponent('RequiredIndicator', RequiredIndicator, [withStyles, styles]);
