import React from 'react';
import { registerComponent } from 'meteor/vulcan:lib';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const baseStyles = theme => ({
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
});

const BackofficeVerticalMenuLayout = ({ side, main, open, classes }) => {
  return (
    <div className={classes.wrapper}>
      <aside className={classnames(classes.side, open && classes.sideOpen, !open && classes.sideClosed)}>{side}</aside>

      <main className={classes.main}>
        <div className={classes.margin}>{main}</div>
      </main>
    </div>
  );
};

registerComponent('VulcanBackofficeVerticalMenuLayout', BackofficeVerticalMenuLayout, [withStyles, baseStyles]);
