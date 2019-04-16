import React from 'react';
import PropTypes from 'prop-types';
import { replaceComponent, Components } from 'meteor/vulcan:core';
import { FormattedMessage } from 'meteor/vulcan:i18n';

import Snackbar from '@material-ui/core/Snackbar';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';


const styles = theme => ({
  root: {
    position: 'relative',
    boxShadow: 'none',
    marginBottom: theme.spacing.unit * 2
  },
  list: {
    marginBottom: 0
  },
  error: { '& > div': { backgroundColor: theme.palette.error[500] } },
  danger: { '& > div': { backgroundColor: theme.palette.error[500] } },
  warning: { '& > div': { backgroundColor: theme.palette.error[500] } }
});


const FormErrors = ({ errors, classes }) => {
  const messageNode = (
    <ul className={classes.list}>
      {errors.map((error, index) => (
        <li key={index}>
          <Components.FormError error={error} />
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      {!!errors.length && (
        <Snackbar
          open={true}
          className={classNames('flash-message', classes.root , classes.danger)}
          message={messageNode}
        />
      )}
    </div>
  );
};


replaceComponent('FormErrors', FormErrors, [withStyles, styles]);
