import React from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent, Utils } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import Fab from '@material-ui/core/Fab';

const styles = theme => ({
  root: {
    display: 'inherit',
  },

  tooltip: {
    margin: '4px !important',
  },

  buttonWrap: {
    display: 'inherit',
  },

  button: {},

  icon: {},

  popoverPopper: {
    zIndex: 1700,
  },

  popoverTooltip: {
    zIndex: 1701,
  },
});

const TooltipIntl = (props, { intl }) => {
  //eslint-disable-next-line no-console
  console.warn(
    'WARNING! TooltipIntl is deprecated in favor of TooltipButton as of vulcan:ui-material 1.13.0_1 and will be deleted in version 1.15.2'
  );

  const {
    title,
    titleId,
    titleValues,
    placement,
    icon,
    className,
    classes,
    theme,
    enterDelay,
    leaveDelay,
    buttonRef,
    variant,
    parent,
    children,
    ...properties
  } = props;

  const iconWithClass = icon && React.cloneElement(icon, { className: classes.icon });
  const popperClass = parent === 'popover' && classes.popoverPopper;
  const tooltipClass = parent === 'popover' && classes.popoverTooltip;
  const tooltipEnterDelay = typeof enterDelay === 'number' ? enterDelay : theme.utils.tooltipEnterDelay;
  const tooltipLeaveDelay = typeof leaveDelay === 'number' ? leaveDelay : theme.utils.tooltipLeaveDelay;
  const titleText = props.title || intl.formatMessage({ id: titleId });
  const slug = Utils.slugify(titleId);

  return (
    <span className={classNames('tooltip-intl', classes.root, className)}>
      <Tooltip
        id={`tooltip-${slug}`}
        title={titleText}
        placement={placement}
        enterDelay={tooltipEnterDelay}
        leaveDelay={tooltipLeaveDelay}
        classes={{
          tooltip: classNames(classes.tooltip, tooltipClass),
          popper: popperClass,
        }}>
        <span className={classes.buttonWrap}>
          {variant === 'fab' && !!icon ? (
            <Fab className={classNames(classes.button, slug)} aria-label={title} ref={buttonRef} {...properties}>
              {iconWithClass}
            </Fab>
          ) : !!icon ? (
            <IconButton className={classNames(classes.button, slug)} aria-label={title} ref={buttonRef} {...properties}>
              {iconWithClass}
            </IconButton>
          ) : variant === 'button' ? (
            <Button className={classNames(classes.button, slug)} aria-label={title} ref={buttonRef} {...properties}>
              {children}
            </Button>
          ) : (
            children
          )}
        </span>
      </Tooltip>
    </span>
  );
};

TooltipIntl.propTypes = {
  title: PropTypes.node,
  titleId: PropTypes.string,
  titleValues: PropTypes.object,
  placement: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object,
  buttonRef: PropTypes.func,
  variant: PropTypes.string,
  theme: PropTypes.object,
  enterDelay: PropTypes.number,
  leaveDelay: PropTypes.number,
  parent: PropTypes.oneOf(['default', 'popover']),
  children: PropTypes.node,
};

TooltipIntl.defaultProps = {
  placement: 'bottom',
  parent: 'default',
};

TooltipIntl.contextTypes = {
  intl: intlShape.isRequired,
};

TooltipIntl.displayName = 'TooltipIntl';

registerComponent('TooltipIntl', TooltipIntl, [withStyles, styles], withTheme);
