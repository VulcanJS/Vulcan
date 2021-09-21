// @see https://github.com/garronej/tss-react
// keep makeStyles syntax around in Mui 5 to make migration easier
import React from 'react';
import { createMakeStyles } from 'tss-react';

function useTheme() {
  return {
    primaryColor: '#32CD32',
  };
}

// material-ui users can pass in useTheme imported like: import { useTheme } from "@material-ui/core/styles";
// material-ui v5 users will also need to pass a custom emotion cache, read later.
export const { makeStyles } = createMakeStyles({ useTheme });

export const withStyles = styles => C => {
  const useStyles = makeStyles(styles);
  return props => {
    const classes = useStyles();
    return <C classes={classes} {...props} />;
  };
};
