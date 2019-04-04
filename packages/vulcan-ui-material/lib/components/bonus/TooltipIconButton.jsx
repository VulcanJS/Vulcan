import React from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent, Utils } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import withTheme from '@material-ui/core/styles/withTheme';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
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
  
  const {
    title,
    titleId,
    placement,
    icon,
    className,
    classes,
    theme,
    buttonRef,
    variant,
    ...properties
  } = props;
  
  const titleText = props.title || intl.formatMessage({ id: titleId });
  const slug = Utils.slugify(titleId);
  
  return (
    <Tooltip classes={{ tooltip: classNames('tooltip-icon-button', classes.tooltip, className) }}
             id={`tooltip-${slug}`}
             title={titleText}
             placement={placement}
             enterDelay={theme.utils.tooltipEnterDelay}
    >
      <div className={classes.buttonWrap}>
        {
          variant === 'fab'
            
            ?
            
            <Button className={classNames(classes.button, slug)}
                    variant="fab"
                    aria-label={title}
                    ref={buttonRef}
                    {...properties}
            >
              {icon}
            </Button>
            
            :
            
            <IconButton className={classNames(classes.button, slug)}
                        aria-label={title}
                        ref={buttonRef}
                        {...properties}
            >
              {icon}
            </IconButton>
        }
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
  variant: PropTypes.string,
  theme: PropTypes.object,
};


TooltipIconButton.defaultProps = {
  placement: 'bottom',
};


TooltipIconButton.contextTypes = {
  intl: intlShape.isRequired,
};


TooltipIconButton.displayName = 'TooltipIconButton';


registerComponent('TooltipIconButton', TooltipIconButton, [withStyles, styles], [withTheme]);
