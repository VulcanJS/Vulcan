import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent, instantiateComponent, Utils } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import withTheme from '@material-ui/core/styles/withTheme';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import classNames from 'classnames';


const styles = theme => ({
  
  root: {
    display: 'contents',
  },
  
  tooltip: {
    margin: '4px !important',
  },
  
  buttonWrap: {
    position: 'relative',
    display: 'inline-block',
  },
  
  button: {},
  
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
  
  progress: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
  },
  
  buttonProgress: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: -2,
    right: -2,
    bottom: -2,
    left: -2,
    zIndex: 1,
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
    size,
    className,
    classes,
    theme,
    enterDelay,
    leaveDelay,
    buttonRef,
    type,
    parent,
    children,
    ...properties
  } = props;
  
  const iconWithClass =  instantiateComponent(icon, { className: classes.icon });
  const popperClass = parent === 'popover' && classes.popoverPopper;
  const tooltipClass = parent === 'popover' && classes.popoverTooltip;
  const tooltipEnterDelay = typeof enterDelay === 'number' ? enterDelay : theme.utils.tooltipEnterDelay;
  const tooltipLeaveDelay = typeof leaveDelay === 'number' ? leaveDelay : theme.utils.tooltipLeaveDelay;
  let titleText = title || (titleId ? intl.formatMessage({ id: titleId }, titleValues) : '');
  let labelText = label || (labelId ? intl.formatMessage({ id: labelId }, titleValues) : '');
  if (type === 'button') {
    if (!labelText) labelText = titleText;
    if (titleText === labelText) titleText = '';
  }
  const slug = Utils.slugify(titleId);
  
  return (
    <span className={classNames('tooltip-button', classes.root, className)}>
      
      <Tooltip id={`tooltip-${slug}`}
               title={titleText}
               placement={placement}
               enterDelay={tooltipEnterDelay}
               leaveDelay={tooltipLeaveDelay}
               classes={{
                 tooltip: classNames(classes.tooltip, tooltipClass),
                 popper: popperClass,
               }}
               PopperProps={{
                 ref: (popper) => { if (popper && popper.popper) popper.popper.scheduleUpdate(); }
               }}
      >
        <span className={classes.buttonWrap}>
          {
            type === 'fab' && !!icon
    
              ?
    
              <>
                <Fab className={classNames(classes.button, slug)}
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
      
                <Button className={classNames(classes.button, slug)}
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
                    <IconButton className={classNames(classes.button, classes[size], slug)}
                                {...properties}
                                aria-label={title}
                                ref={buttonRef}
                                disabled={loading || disabled}
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
  title: PropTypes.node,
  titleId: PropTypes.string,
  titleValues: PropTypes.object,
  label: PropTypes.node,
  labelId: PropTypes.string,
  type: PropTypes.oneOf(['simple', 'fab', 'button', 'submit', 'icon']),
  size: PropTypes.oneOf(['icon', 'xsmall', 'small', 'medium', 'large']),
  placement: PropTypes.string,
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


registerComponent('TooltipButton', TooltipButton, [withStyles, styles], [withTheme]);
