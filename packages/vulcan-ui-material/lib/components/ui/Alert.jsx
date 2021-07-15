/**
 * @Author: Apollinaire Lecocq <apollinaire>
 * @Date:   09-01-19
 * @Last modified by:   apollinaire
 * @Last modified time: 10-01-19
 */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { registerComponent } from 'meteor/vulcan:core';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const AlertStyle = theme => ({
  error: {
    color: theme.palette.error.main,
    backgroundColor: theme.palette.error[100],
    fontFamily: theme.typography.fontFamily,
  },
  other: {
    fontFamily: theme.typography.fontFamily,
  },
});

const Alert = ({ children, variant, classes, ...rest }) => (
  <Card className={variant === 'danger' ? classes.error : classes.other}>
    <CardContent>{children}</CardContent>
  </Card>
);

registerComponent({ name: 'Alert', component: Alert, hocs: [[withStyles, AlertStyle]] });
