import React from 'react';
import { registerComponent } from 'meteor/vulcan:lib';

const styles = {
  wrapper: {
    display: 'flex',
    overflow: 'auto',
    height: '100%',
  },
  side: {
    top: '0',
    left: '0',
    height: '100%',
    overflowX: 'hidden',
    backgroundColor: '#f7f7f7',
    borderRight: '1px solid #ececec',
    padding: '0',
    transition: 'all 0.5s ease-out',
  },
  sideOpen: {
    minWidth: '200px',
    width: '200px',
    visibility: 'visible',
  },
  sideClosed: {
    minWidth: '0',
    width: '0',
    visibility: 'hidden',
  },
  main: {
    flexGrow: '1',
    overflow: 'auto',
  },
  margin: {
    margin: '16px',
  },
};

const BackofficeVerticalMenuLayout = ({ side, main, open }) => {
  return (
    <div style={styles.wrapper}>
      <div style={open ? { ...styles.side, ...styles.sideOpen } : { ...styles.side, ...styles.sideClosed }}>{side}</div>

      <div style={styles.main}>
        <div style={styles.margin}>{main}</div>
      </div>
    </div>
  );
};

registerComponent('VulcanBackofficeVerticalMenuLayout', BackofficeVerticalMenuLayout);
