import PropTypes from 'prop-types';
import React from 'react';
import { instantiateComponent } from 'meteor/vulcan:core';
import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from 'mdi-material-ui/OpenInNew';
import WebIcon from 'mdi-material-ui/Web';
import EmailIcon from 'mdi-material-ui/EmailOutline';
import { styles } from './EndAdornment';


export const hideStartAdornment = (props) => {
  const { type, hideLink } = props;
  return !props.addonBefore && (!['url', 'email'].includes(type) || hideLink);
};


export const fixUrl = (url, type) => {
  if (type === 'email') {
    return `mailto:${url}`;
  }
  return url.indexOf('http://') === -1 && url.indexOf('https://') ? 'http://' + url : url;
};


const StartAdornment = (props) => {
  const { classes, value, type, addonBefore } = props;
  
  if (hideStartAdornment(props)) return null;
  
  const urlButton = ['url', 'email'].includes(type) &&
    <IconButton
      className={classes.urlButton}
      href={fixUrl(value, type)}
      target="_blank"
      disabled={!value}
    >
      {
        type === 'url'
          ?
          <WebIcon/>
          :
          <EmailIcon/>
      }
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
