import React from 'react';
import PropTypes from 'prop-types';
import { instantiateComponent } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from 'mdi-material-ui/CloseCircle';
import MenuDownIcon from 'mdi-material-ui/MenuDown';
import classNames from 'classnames';
import _omit from 'lodash/omit';


export const styles = theme => ({

  inputAdornment: {
    whiteSpace: 'nowrap',
    marginTop: '0 !important',
    '& > *': {
      verticalAlign: 'bottom',
    },
    '& > svg': {
      color: theme.palette.common.darkBlack,
    },
    '& > * + *': {
      marginLeft: 8,
    },
    height: 'auto',
  },

  menuIndicator: {
    padding: 10,
    marginRight: -40,
    marginLeft: -16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.midBlack,
    pointerEvents: 'none',
    transition: theme.transitions.create(['opacity'], {
      duration: theme.transitions.duration.short,
    }),
  },

  clearButton: {
    opacity: 0,
    '& svg': {
      width: 20,
      height: 20,
    },
    marginRight: -12,
    marginLeft: -4,
    '&:first-child': {
      marginLeft: -12,
    },
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.short,
    }),
  },

  urlButton: {
    width: 40,
    height: 40,
    fontSize: 20,
    marginLeft: -4,
    marginRight: -4,
  },

});


const EndAdornment = (props, context) => {
  const { classes, value, addonAfter, changeValue, showMenuIndicator, hideClear, disabled } = props;
  const { intl } = context;

  if (!addonAfter && (!changeValue || hideClear || disabled)) return null;
  const hasValue = !!value || value === 0;

  const clearButton = changeValue && !hideClear && !disabled &&
    <IconButton className={classNames('clear-button', classes.clearButton, hasValue && 'has-value')}
                onClick={event => {
                  event.preventDefault();
                  changeValue(null);
                }}
                onMouseDown={event => {
                  event.preventDefault();
                }}
                tabIndex={-1}
                aria-label={intl.formatMessage({ id: 'forms.delete_field' })}
                disabled={!hasValue}
    >
      <CloseIcon/>
    </IconButton>;

  const menuIndicator = showMenuIndicator && !disabled &&
    <div className={classNames('menu-indicator', classes.menuIndicator, hasValue && 'has-value')}>
      <MenuDownIcon/>
    </div>;

  return (
    <InputAdornment classes={{ root: classes.inputAdornment }} position="end">
      {instantiateComponent(addonAfter, _omit(props, ['classes']))}
      {menuIndicator}
      {clearButton}
    </InputAdornment>
  );
};


EndAdornment.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.any,
  changeValue: PropTypes.func,
  showMenuIndicator: PropTypes.bool,
  hideClear: PropTypes.bool,
  addonAfter: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
};

EndAdornment.contextTypes = {
  intl: intlShape,
};

export default withStyles(styles)(EndAdornment);
