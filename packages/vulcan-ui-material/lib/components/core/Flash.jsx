import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Utils, replaceComponent, registerSetting, getSetting } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from 'mdi-material-ui/Close';
import Slide from '@material-ui/core/Slide';
import DOMPurify from 'dompurify';


registerSetting('flash.infoHideSeconds', 5, 'Seconds to display flash info messages');
registerSetting('flash.errorHideSeconds', 15, 'Seconds to display flash error messages');


const styles = theme => ({

  root: {
    maxWidth: 600,
    transition: theme.transitions.create(['opacity'], {
      duration: theme.transitions.duration.short,
    }),
    opacity: theme.opacity.darker,
    '&:hover': {
      opacity: 1,
    },
    '& code': {
      fontSize: '0.9rem',
    },
  },

  alert: {
    lineHeight: 1.3,
  },

  infoAlert: {
    backgroundColor: theme.palette.grey[800],
  },

});

const useStyles = makeStyles(styles);


const Flash = (props, context) => {
  const [isOpen, setIsOpen] = useState(true);
  const classes = useStyles(props);
  const intl = context.intl;
  const { message, type, _id } = props.message;
  const infoOrError = ['info', 'success'].includes(type) ? 'info' : 'error';
  const hideDuration = getSetting(`flash.${infoOrError}HideSeconds`) * 1000;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;

      setIsOpen(false);
      setTimeout(() => { props.dismissFlash(props.message._id); }, 500);
  };

  return (
    <Snackbar key={message.content}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={isOpen}
              TransitionComponent={Slide}
              classes={{ root: classes.root }}
              autoHideDuration={hideDuration}
              onClose={handleClose}
              ContentProps={{
                'aria-describedby': _id,
              }}
              action={[
                <IconButton key="close"
                            aria-label={intl.formatMessage({ id: 'global.close' })}
                            color="inherit"
                            onClick={handleClose}
                >
                  <CloseIcon/>
                </IconButton>,
              ]}
    >
      <Alert onClose={handleClose}
             severity={infoOrError}
             variant="filled"
             classes={{
               root: classes.alert,
               filledInfo: classes.infoAlert,
             }}
      >
        <span id={_id} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message) }}/>
      </Alert>
    </Snackbar>
  );
};


Flash.propTypes = {
  message: PropTypes.object.isRequired,
  dismissFlash: PropTypes.func.isRequired,
};


Flash.contextTypes = {
  intl: intlShape.isRequired,
};


Flash.displayName = 'Flash';


replaceComponent('Flash', Flash);
export default Flash;
