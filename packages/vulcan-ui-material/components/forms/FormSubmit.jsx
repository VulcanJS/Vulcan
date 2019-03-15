import React from 'react';
import PropTypes from 'prop-types';
import { Components, replaceComponent } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from 'mdi-material-ui/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import classNames from 'classnames';


const styles = theme => ({
  root: {
    textAlign: 'center',
    marginTop: theme.spacing.unit * 4,
  },
  button: {
    margin: theme.spacing.unit,
  },
  delete: {
    float: 'left',
  },
  tooltip: {
    margin: 3,
  }
});


const FormSubmit = ({
                      submitLabel,
                      cancelLabel,
                      cancelCallback,
                      revertLabel,
                      revertCallback,
                      document,
                      deleteDocument,
                      collectionName,
                      classes
                    }, {
                      intl,
                      isChanged,
                      clearForm,
                    }) => {

  if (typeof isChanged !== 'function') {
    isChanged = () => true;
  }

  return (
    <div className={classes.root}>

      {
        deleteDocument
          ?
          <Tooltip id={`tooltip-delete-${collectionName}`}
                   classes={{ tooltip: classNames('delete-button', classes.tooltip) }}
                   title={intl.formatMessage({ id: 'forms.delete' })}
                   placement="bottom">
            <IconButton onClick={deleteDocument} className={classes.delete}>
              <DeleteIcon/>
            </IconButton>
          </Tooltip>
          :
          null
      }

      {
        cancelCallback
          ?
          <Button variant="contained"
                  className={classNames('cancel-button', classes.button)}
                  onClick={(event) => {
                    event.preventDefault();
                    cancelCallback(document);
                  }}>
            {cancelLabel ? cancelLabel : <FormattedMessage id="forms.cancel"/>}
          </Button>
          :
          null
      }

      {
        revertCallback
          ?
          <Button variant="contained"
                  className={classNames('revert-button', classes.button)}
                  disabled={!isChanged()}
                  onClick={(event) => {
                    event.preventDefault();
                    clearForm({ clearErrors: true, clearCurrentValues: true, clearDeletedValues: true });
                    revertCallback(document);
                  }}
          >
            {revertLabel ? revertLabel : <FormattedMessage id="forms.revert"/>}
          </Button>
          :
          null
      }

      <Button variant="contained"
              type="submit"
              color="secondary"
              className={classNames('submit-button', classes.button)}
              disabled={!isChanged()}
      >
        {submitLabel ? submitLabel : <FormattedMessage id="forms.submit"/>}
      </Button>

    </div>
  );
};


FormSubmit.propTypes = {
  submitLabel: PropTypes.node,
  cancelLabel: PropTypes.node,
  revertLabel: PropTypes.node,
  cancelCallback: PropTypes.func,
  revertCallback: PropTypes.func,
  document: PropTypes.object,
  deleteDocument: PropTypes.func,
  collectionName: PropTypes.string,
  classes: PropTypes.object,
};


FormSubmit.contextTypes = {
  intl: intlShape,
  isChanged: PropTypes.func,
  clearForm: PropTypes.func,
};


replaceComponent('FormSubmit', FormSubmit, [withStyles, styles]);
