import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent, Components } from 'meteor/vulcan:core';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Close from 'mdi-material-ui/Close';
import classNames from 'classnames';

const styles = theme => ({
  dialog: {},

  dialogPaper: {},

  dialogTitle: {},

  dialogTitleEmpty: {
    padding: 0,
    height: theme.spacing(3),
  },

  dialogContent: {
    paddingTop: '4px',
  },

  dialogOverflow: {
    overflowY: 'visible',
  },

  closeButton: {
    display: 'block !important',
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
});

const Modal = props => {
  const {
    children,
    className,
    show = false,
    onHide,
    title,
    showCloseButton = true,
    dialogOverflow,
    dialogProps,
    classes,
    ...rest
  } = props;

  const overflowClass = dialogOverflow && classes.dialogOverflow;

  return (
    <Dialog
      className={className}
      open={show}
      onClose={onHide}
      onClick={event => {
        event.stopPropagation();
      }}
      fullWidth={true}
      classes={{ paper: classNames(classes.dialogPaper, overflowClass) }}
      {...dialogProps}>
      <DialogTitle className={title ? classes.dialogTitle : classes.dialogTitleEmpty}>
        {title}

        {showCloseButton && (
          <Components.TooltipButton
            className={classes.closeButton}
            icon={<Close />}
            titleId="global.close"
            onClick={onHide}
            aria-label="Close"
          />
        )}
      </DialogTitle>

      <DialogContent className={classNames(classes.dialogContent, overflowClass)}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

Modal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  show: PropTypes.bool,
  onHide: PropTypes.func,
  title: PropTypes.node,
  showCloseButton: PropTypes.bool,
  dialogOverflow: PropTypes.bool,
  dialogProps: PropTypes.object,
  classes: PropTypes.object,
};

registerComponent('Modal', Modal, [withStyles, styles]);
