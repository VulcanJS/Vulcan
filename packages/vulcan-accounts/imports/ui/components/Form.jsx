import React from 'react';
import ReactDOM from 'react-dom';
import { Components, registerComponent } from 'meteor/vulcan:core';

export class AccountsForm extends React.Component {
  componentDidMount() {
    let form = this.form;
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
      });
    }
  }

  render() {
    const {
      hasPasswordService,
      oauthServices,
      fields,
      buttons,
      error,
      messages,
      ready = true,
      className
    } = this.props;
    return (
      <form
        ref={(ref) => this.form = ref}
        className={[className, ready ? "ready" : null].join(' ')}
        className="accounts-ui"
        noValidate
      >
        <Components.AccountsFields fields={ fields } />
        <Components.AccountsButtons buttons={ buttons } />
        <Components.AccountsPasswordOrService oauthServices={ oauthServices } />
        <Components.AccountsSocialButtons oauthServices={ oauthServices } />
        <Components.AccountsFormMessages messages={messages} />
      </form>
    );
  }
}
AccountsForm.propTypes = {
  oauthServices: React.PropTypes.object,
  fields: React.PropTypes.object.isRequired,
  buttons: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  ready: React.PropTypes.bool
};

registerComponent('AccountsForm', AccountsForm);