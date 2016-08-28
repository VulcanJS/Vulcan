import React, { PropTypes, Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';
import { Accounts } from 'meteor/std:accounts-ui';

const UsersAccountForm = () => {
  return (
    <Accounts.ui.LoginForm />
  ) 
};

module.exports = UsersAccountForm;
export default UsersAccountForm;

// customize Accounts.ui

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL',
  onSignedInHook: () => {},
  onSignedOutHook: () => {},
});

class AccountsButton extends Accounts.ui.Button {
  render () {
    const {label, href, type, disabled, className, onClick} = this.props;
    if (type === 'link') {
      return <a href={ href } className={ className } onClick={ onClick }>{ label }</a>;
    }
    return <Button 
        bsStyle="primary"
        className={ className }
        type={ type } 
        disabled={ disabled }
        onClick={ onClick }>{ label }
      </Button>;
  }
}

class AccountsField extends Accounts.ui.Field {

  // see https://github.com/studiointeract/accounts-ui/issues/60
  triggerUpdate () {
    const { onChange } = this.props
    if (this.input) {
      onChange({ target: { value: this.input.value } })
    }
  }
  
  render() {
    const { id, hint, label, type = 'text', onChange, className = "field", defaultValue = "" } = this.props;
    const { mount = true } = this.state;
    return mount ? (
      <div className={ className }>
        <FormControl id={ id } type={ type } onChange={ onChange } placeholder={ hint } defaultValue={ defaultValue } />
      </div>
    ) : null;
  }
}

// class AccountsSocialButtons extends Accounts.ui.SocialButtons {
//   render () {
//     let { oauthServices = {}, className = "social_buttons" } = this.props;
//     return(
//       <div className={ className }>
//         {Object.keys(oauthServices)
//           .filter(service => oauthServices[service].disabled) // filter services registered but not enabled
//           .map((id, i) => <Accounts.ui.Button {...oauthServices[id]} key={i} />)}
//       </div>
//     );

//   }
// }

// class AccountsPasswordOrService extends Accounts.ui.PasswordOrService {
//   render () {
//     let {
//       oauthServices = {},
//       className,
//       style = {}
//       } = this.props;
//     let { hasPasswordService } = this.state;
//     let labels = Object.keys(oauthServices)
//       .filter(service => oauthServices[service].disabled) // filter services registered but not enabled
//       .map(service => oauthServices[service].label);
//     if (labels.length > 2) {
//       labels = [];
//     }

//     if (hasPasswordService && labels.length > 0) {
//       return (
//         <div style={ style } className={ className }>
//           { `${T9n.get('or use')} ${ labels.join(' / ') }` }
//         </div>
//       );
//     }
//     return null;
//   }
// }

Accounts.ui.Button = AccountsButton;
Accounts.ui.Field = AccountsField;
// Accounts.ui.SocialButtons = AccountsSocialButtons;
// Accounts.ui.PasswordOrService = AccountsPasswordOrService;