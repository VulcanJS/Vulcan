import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent, instantiateComponent, Utils } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import classNames from 'classnames';


const styles = theme => ({

  root: {
    display: 'contents',
  },

  tooltip: {},

  buttonWrap: {
    position: 'relative',
    display: 'inline-flex',
  },

  button: {},

  fab: {},

  menu: {},

  popoverPopper: {
    zIndex: 1700,
  },

  popoverTooltip: {
    zIndex: 1701,
  },

  iconWrap: {
    position: 'relative',
  },

  icon: {
    width: 24,
    height: 24,
  },

  xsmall: {
    width: 32,
    height: 32,
  },

  small: {
    width: 40,
    height: 40,
  },

  medium: {
    width: 48,
    height: 48,
  },

  large: {
    width: 56,
    height: 56,
  },

  dangerButton: {
    ...theme.utils.dangerButton,
  },

  progress: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    //zIndex: 1,
    pointerEvents: 'none',
  },

  buttonProgress: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: -4,
    right: -4,
    bottom: -4,
    left: -4,
    //zIndex: 1,
  },

});

const TooltipButton = (props, { intl }) => {
  const {
    title,
    titleId,
    titleValues,
    label,
    labelId,
    placement,
    icon,
    loading,
    disabled,
    type,
    size,
    danger,
    className,
    classes,
    theme,
    enterDelay,
    leaveDelay,
    buttonRef,
    parent,
    children,
    cursor,
    TooltipProps,
    ...properties
  } = props;

  const iconWithClass = instantiateComponent(icon, { className: classNames('icon', classes.icon) });
  const popperClass = parent === 'popover' && classes.popoverPopper;
  const tooltipClass = parent === 'popover' && classes.popoverTooltip;
  const tooltipEnterDelay = typeof enterDelay === 'number' ? enterDelay : theme.utils.tooltipEnterDelay;
  const tooltipLeaveDelay = typeof leaveDelay === 'number' ? leaveDelay : theme.utils.tooltipLeaveDelay;
  let titleText = title || (titleId ? intl.formatMessage({ id: titleId }, titleValues) : '');
  let labelText = label || (labelId ? intl.formatMessage({ id: labelId }, titleValues) : '');
  if (type === 'button' || type === 'menu') {
    if (!labelText) labelText = titleText;
    if (titleText === labelText) titleText = '';
  }
  const slug = Utils.slugify(titleId || labelId);
  const buttonWrapStyle = cursor ? { cursor: cursor } : null;

  return (
    <span className={classNames('tooltip-button', classes.root, className)}>

      <Tooltip id={`tooltip-${slug}`}
               title={titleText}
               placement={placement}
               arrow
               enterDelay={tooltipEnterDelay}
               leaveDelay={tooltipLeaveDelay}
               classes={{
                 tooltip: classNames(classes.tooltip, tooltipClass),
                 popper: popperClass,
               }}
               PopperProps={{
                 ref: (popper) => { if (popper && popper.popper) popper.popper.scheduleUpdate(); },
               }}
               {...TooltipProps}
      >
        <span className={classes.buttonWrap} style={buttonWrapStyle}>
          {
            type === 'menu'

              ?

              <MenuItem className={classNames(classes.menu, slug)}
                        {...properties}
                        button={true}
                        disabled={loading || disabled}
              >
                <ListItemIcon>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={labelText}/>
              </MenuItem>

              :

              type === 'fab' && !!icon

                ?

                <>
                  <Fab className={classNames(classes.button, classes.fab, danger && classes.dangerButton, slug)}
                       {...properties}
                       size={size}
                       aria-label={title}
                       ref={buttonRef}
                       disabled={loading || disabled}
                  >
                    {iconWithClass}
                  </Fab>
                  {loading && <CircularProgress size="auto" className={classes.progress}/>}
                </>

                :

                ['button', 'submit'].includes(type)

                  ?

                  <Button className={classNames(classes.button, danger && classes.dangerButton, slug)}
                          {...properties}
                          type={type}
                          size={size}
                          aria-label={title}
                          ref={buttonRef}
                          disabled={loading || disabled}
                  >
                    {
                      iconWithClass &&

                      <span className={classNames('icon-wrap', classes.iconWrap)}>
                        {iconWithClass}
                        {loading && <CircularProgress size="auto" className={classes.buttonProgress}/>}
                      </span>
                    }
                    {labelText}
                  </Button>

                  :

                  !!icon

                    ?

                    <>
                      <IconButton
                        className={classNames(classes.button, danger && classes.dangerButton, classes[size], slug)}
                        {...properties}
                        aria-label={title}
                        ref={buttonRef}
                        disabled={(loading && !(disabled === false)) || disabled}
                      >
                        {iconWithClass}
                      </IconButton>
                      {loading && <CircularProgress size="auto" className={classes.progress}/>}
                    </>

                    :

                    children
          }
        </span>
      </Tooltip>

    </span>
  );

};

TooltipButton.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  titleId: PropTypes.string,
  titleValues: PropTypes.object,
  label: PropTypes.node,
  labelId: PropTypes.string,
  type: PropTypes.oneOf(['simple', 'fab', 'button', 'submit', 'icon', 'menu']),
  size: PropTypes.oneOf(['icon', 'xsmall', 'small', 'medium', 'large']),
  danger: PropTypes.bool,
  placement: PropTypes.oneOf(['bottom-end', 'bottom-start', 'bottom',
    'left-end', 'left-start', 'left', 'right-end', 'right-start', 'right', 'top-end', 'top-start', 'top']),
  icon: PropTypes.node,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  classes: PropTypes.object,
  buttonRef: PropTypes.func,
  theme: PropTypes.object,
  enterDelay: PropTypes.number,
  leaveDelay: PropTypes.number,
  parent: PropTypes.oneOf(['default', 'popover']),
  children: PropTypes.node,
  cursor: PropTypes.string,
  TooltipProps: PropTypes.object,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary']),
};

TooltipButton.defaultProps = {
  placement: 'bottom',
  parent: 'default',
  size: 'medium',
};

TooltipButton.contextTypes = {
  intl: intlShape.isRequired,
};

TooltipButton.displayName = 'TooltipButton';

registerComponent('TooltipButton', TooltipButton, [withStyles, styles], withTheme);

export default TooltipButton;
