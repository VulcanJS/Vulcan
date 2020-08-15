import PropTypes from 'prop-types';
import React from 'react';
import { instantiateComponent } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import WebIcon from 'mdi-material-ui/Web';
import EmailIcon from 'mdi-material-ui/EmailOutline';
import { styles } from './EndAdornment';


const linkTypes = ['url', 'email', 'social'];


export const hideStartAdornment = (props) => {
  const { type, hideLink } = props;
  return !props.addonBefore && (!linkTypes.includes(type) || hideLink);
};


const StartAdornment = (props, context) => {
  const { intl } = context;

  if (hideStartAdornment(props)) return null;

  const { classes, type, scrubValue, getUrl } = props;
  let value = props.value;
  if (scrubValue) {
    value = scrubValue(value, props);
  }
  const url = getUrl ? getUrl(value, props) : value;
  const socialIcon = type === 'social' ? props.addonBefore : undefined;
  const addonBefore = type === 'social' ? undefined : props.addonBefore;

  const urlButton = linkTypes.includes(type) &&
    <IconButton className={classes.urlButton}
                href={url}
                target="_blank"
                disabled={!value}
                aria-label={intl.formatMessage({
                  id: `forms.start_adornment_${type}_icon`,
                })}
    >
      {
        type === 'email'
          ?
          <EmailIcon/>
          :
          socialIcon
            ?
            instantiateComponent(socialIcon)
            :
            <WebIcon/>
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

StartAdornment.contextTypes = {
  intl: intlShape,
};

export default withStyles(styles)(StartAdornment);
