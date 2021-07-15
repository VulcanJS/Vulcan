import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Components, registerComponent } from 'meteor/vulcan:core';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  messages: {
    '& .message': theme.utils.errorMessage
  },
});


export class AccountsForm extends Component {
  
  
  componentDidMount () {
    let form = this.form;
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
      });
    }
  }
  
  
  render () {
    const {
      oauthServices,
      fields,
      buttons,
      messages,
      ready = true,
      className,
      classes,
    } = this.props;
  
    return (
      <form ref={(ref) => this.form = ref}
            className={classNames(className, 'accounts-ui', { 'ready': ready, })}
            noValidate
      >
        <Components.AccountsFields fields={fields} messages={messages}/>
        <Components.AccountsButtons buttons={{...buttons}}/>
        <Components.AccountsPasswordOrService oauthServices={oauthServices}/>
        <Components.AccountsSocialButtons oauthServices={oauthServices}/>
        <Components.AccountsFormMessages messages={messages} className={classes.messages}/>
      </form>
    );
  }
  
  
}


AccountsForm.propTypes = {
  oauthServices: PropTypes.object,
  fields: PropTypes.object.isRequired,
  buttons: PropTypes.object.isRequired,
  error: PropTypes.string,
  ready: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};


AccountsForm.displayName = 'AccountsForm';


registerComponent('AccountsForm', AccountsForm, [withStyles, styles]);
