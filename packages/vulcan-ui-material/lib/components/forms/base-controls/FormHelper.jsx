import React from 'react';
import PropTypes from 'prop-types';
import { Components } from 'meteor/vulcan:core';
import { withStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import classNames from 'classnames';


export const styles = theme => ({

  error: {
    color: theme.palette.error.main,
  },

  formHelperText: {
    display: 'flex',
    '& :first-child': {
      flexGrow: 1,
    }
  },
  
  charCount: {
    whiteSpace: 'nowrap',
    marginLeft: theme.spacing(1),
  },

});


const FormHelper = (props) => {
  const {
    className,
    classes,
    help,
    errors,
    hasErrors,
    showCharsRemaining,
    charsRemaining,
    charsCount,
    max,
  } = props;

  if (!help && !hasErrors && !showCharsRemaining) {
    return null;
  }

  const errorMessage = hasErrors &&
    <Components.FormError error={errors[0]} />;

  return (
    <FormHelperText className={classNames(className, classes.formHelperText)} error={hasErrors}>

      <span>
        {
          hasErrors ? errorMessage : help
        }
      </span>

      {
        showCharsRemaining &&

        <span className={classNames(classes.charCount, charsRemaining < 0 ? classes.error : null)}>
          {charsCount} / {max}
        </span>
      }

    </FormHelperText>
  );
};


FormHelper.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  value: PropTypes.any,
  changeValue: PropTypes.func,
  addonAfter: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
};


export default withStyles(styles)(FormHelper);
