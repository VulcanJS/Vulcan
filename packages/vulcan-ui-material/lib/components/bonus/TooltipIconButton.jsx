import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent, Utils } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import { withStyles } from '../../modules/makeStyles';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import classNames from 'classnames';

const styles = theme => ({
  root: {},
  tooltip: {
    margin: '4px !important',
  },
  buttonWrap: {
    display: 'inline-block',
  },
  button: {},
});

const TooltipIconButton = (props, { intl }) => {
  //eslint-disable-next-line no-console
  console.warn(
    'WARNING! TooltipIconButton is deprecated in favor of TooltipButton as of vulcan:ui-material 1.13.0_1 and will be deleted in version 1.15.2'
  );

  const { title, titleId, placement, icon, className, classes, buttonRef, variant, ...properties } = props;
  const theme = useTheme();

  const titleText = props.title || intl.formatMessage({ id: titleId });
  const slug = Utils.slugify(titleId);

  return (
    <Tooltip
      classes={{ tooltip: classNames('tooltip-icon-button', classes.tooltip, className) }}
      id={`tooltip-${slug}`}
      title={titleText}
      placement={placement}
      enterDelay={theme.utils.tooltipEnterDelay}>
      <div className={classes.buttonWrap}>
        {variant === 'fab' ? (
          <Fab className={classNames(classes.button, slug)} aria-label={titleText} ref={buttonRef} {...properties}>
            {icon}
          </Fab>
        ) : (
          <IconButton className={classNames(classes.button, slug)} aria-label={titleText} ref={buttonRef} {...properties} size="large">
            {icon}
          </IconButton>
        )}
      </div>
    </Tooltip>
  );
};

TooltipIconButton.propTypes = {
  title: PropTypes.node,
  titleId: PropTypes.string,
  placement: PropTypes.string,
  icon: PropTypes.node.isRequired,
  className: PropTypes.string,
  classes: PropTypes.object,
  buttonRef: PropTypes.func,
  variant: PropTypes.object,
};

TooltipIconButton.defaultProps = {
  placement: 'bottom',
};

TooltipIconButton.contextTypes = {
  intl: intlShape.isRequired,
};

TooltipIconButton.displayName = 'TooltipIconButton';

registerComponent('TooltipIconButton', TooltipIconButton, [withStyles, styles]);
