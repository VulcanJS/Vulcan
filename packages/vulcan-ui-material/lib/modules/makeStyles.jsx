// @see https://github.com/garronej/tss-react
// keep makeStyles syntax around in Mui 5 to make migration easier
// NOTE: you should prefer using recommended API (styled, sx)
import { deprecate } from 'meteor/vulcan:lib';
import React from 'react';
import { createMakeStyles } from 'tss-react';
import { useTheme } from '@mui/material/styles';

// material-ui users can pass in useTheme imported like: import { useTheme } from "@material-ui/core/styles";
// material-ui v5 users will also need to pass a custom emotion cache, read later.
const { makeStyles: rawMakeStyles } = createMakeStyles({ useTheme });
// tss-react has a slightly different API than mui v4,
// as well as useStyles
// We change it to fit mui v4 syntax
import debounce from 'lodash/debounce';
const debouncedDeprecate = debounce(deprecate, 500);
export const makeStyles = (...args) => {
  debouncedDeprecate('any', 'makeStyles syntax is deprecated, prefer using styled/sx props');
  const rawUseStyles = rawMakeStyles()(...args);
  // useStyle syntax also is slightly different in tss-react, because
  // it returns more than classes. But we only use classes here.
  const useStyles = (...args) => {
    const { classes } = rawUseStyles(...args);
    return classes;
  };
  return useStyles;
};

export const withStyles = styles => C => {
  const useStyles = makeStyles(styles);
  return props => {
    const classes = useStyles();
    return <C {...props} classes={classes} />;
  };
};
