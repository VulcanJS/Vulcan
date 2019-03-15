import React from 'react';
import PropTypes from 'prop-types';
import { replaceComponent } from 'meteor/vulcan:core';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const FormNestedArrayLayout = ({ hasErrors, label, content }) => (
  <div>
    <Typography component="label" variant="caption" style={{ fontSize: 16 }}>
      {label}
    </Typography>
    <div>{content}</div>
  </div>
);
FormNestedArrayLayout.propTypes = {
  hasErrors: PropTypes.bool,
  label: PropTypes.node,
  content: PropTypes.node,
};
replaceComponent({
  name: 'FormNestedArrayLayout',
  component: FormNestedArrayLayout,
});
