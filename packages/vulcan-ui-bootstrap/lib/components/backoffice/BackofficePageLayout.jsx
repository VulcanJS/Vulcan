import React from 'react';
import { registerComponent } from 'meteor/vulcan:lib';

const styles = {
  pageLayout: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
};

const BackofficePageLayout = ({ children }) => {
  return <div style={styles.pageLayout}>{children}</div>;
};

registerComponent('VulcanBackofficePageLayout', BackofficePageLayout);
