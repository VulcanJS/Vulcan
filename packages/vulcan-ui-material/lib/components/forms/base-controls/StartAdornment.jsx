import PropTypes from 'prop-types';
import React from 'react';
import { instantiateComponent } from 'meteor/vulcan:core';
import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from 'mdi-material-ui/OpenInNew';
import { styles } from './EndAdornment';


export const hideStartAdornment = (props) => {
  return !props.addonBefore && !props.isUrl;
};


export const fixUrl = (url) => {
  return url.indexOf('http://') === -1 && url.indexOf('https://') ? 'http://' + url : url;
};


const StartAdornment = (props) => {
  const { classes, value, type, addonBefore } = props;
  
  if (hideStartAdornment(props)) return null;
  
  const urlButton = type === 'url' &&
    <IconButton
      className={classes.urlButton}
      href={fixUrl(value)}
      target="_blank"
      disabled={!value}
    >
      <OpenInNewIcon/>
    </IconButton>;
  
  
  return (
    <InputAdornment classes={{ root: classes.inputAdornment }} position="start">
      {instantiateComponent(addonBefore)}
      {urlButton}
    </InputAdornment>
  );
};


StartAdornment.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.any,
  type: PropTypes.string,
  addonBefore: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.func]),
};


export default withStyles(styles)(StartAdornment);
