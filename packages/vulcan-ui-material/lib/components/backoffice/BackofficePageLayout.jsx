import React from 'react';
import { registerComponent } from 'meteor/vulcan:lib';
import withStyles from '@mui/styles/withStyles';

const baseStyles = theme => ({
  pageLayout: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
});

const BackofficePageLayout = ({ children, classes }) => {
  return <div className={classes.pageLayout}>{children}</div>;
};

registerComponent('VulcanBackofficePageLayout', BackofficePageLayout, [withStyles, baseStyles]);
