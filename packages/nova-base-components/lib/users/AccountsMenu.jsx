import React, { PropTypes, Component } from 'react';
import Router from '../router.js';
import { Dropdown } from 'react-bootstrap';
import { Button, Input } from 'react-bootstrap';

import { Accounts } from 'meteor/std:accounts-ui';

const AccountsMenu = () => {

  ({UserAvatar, UserName} = Telescope.components);

  return (
    <Dropdown id="accounts-dropdown" className="user-menu-dropdown">
      <Dropdown.Toggle>
        Log In
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Accounts.ui.LoginForm />
      </Dropdown.Menu>
    </Dropdown>
  ) 
};

module.exports = AccountsMenu;
export default AccountsMenu;

// customize Accounts.ui

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL',
  onSignedInHook: () => {},
  onSignedOutHook: () => {},
});

class AccountsButton extends Accounts.ui.Button {
  render() {
    const { label, type, disabled = false, onClick, className } = this.props;
    return type == 'link' ? (
      <Button bsStyle="default" href="#" className={className} onClick={onClick} >{label}</Button>
    ) : (
      <Button bsStyle="primary" className={className} onClick={onClick} disabled={disabled}>{label}</Button>
    );
  }
}

class AccountsField extends Accounts.ui.Field {
  render() {
    const { id, hint, label, type = 'text', onChange, className = "field" } = this.props;
    return (
      <div className={className}>
        <Input name={id} id={id} type={type} onChange={onChange} placeholder={hint} defaultValue="" />
      </div>
    );
  }
}

class AccountsSocialButtons extends Accounts.ui.SocialButtons {
  render () {
    let { oauthServices = {}, className = "social_buttons" } = this.props;
    return(
      <div className={ className }>
        {Object.keys(oauthServices)
          .filter(service => oauthServices[service].disabled) // filter services registered but not enabled
          .map((id, i) => <Accounts.ui.Button {...oauthServices[id]} key={i} />)}
      </div>
    );

  }
}

class AccountsPasswordOrService extends Accounts.ui.PasswordOrService {
  render () {
    let {
      oauthServices = {},
      className,
      style = {}
      } = this.props;
    let { hasPasswordService } = this.state;
    let labels = Object.keys(oauthServices)
      .filter(service => oauthServices[service].disabled) // filter services registered but not enabled
      .map(service => oauthServices[service].label);
    if (labels.length > 2) {
      labels = [];
    }

    if (hasPasswordService && labels.length > 0) {
      return (
        <div style={ style } className={ className }>
          { `${T9n.get('or use')} ${ labels.join(' / ') }` }
        </div>
      );
    }
    return null;
  }
}

Accounts.ui.Button = AccountsButton;
Accounts.ui.Field = AccountsField;
Accounts.ui.SocialButtons = AccountsSocialButtons;
Accounts.ui.PasswordOrService = AccountsPasswordOrService;
