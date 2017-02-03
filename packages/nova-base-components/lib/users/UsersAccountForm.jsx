import { registerComponent } from 'meteor/nova:core';
import React, { PropTypes, Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';
import { Accounts } from 'meteor/std:accounts-ui';
import { withApollo } from 'react-apollo';

const UsersAccountForm = ({client}) => {
  return (
    <Accounts.ui.LoginForm 
      onPostSignUpHook={() => client.resetStore()}
      onSignedInHook={() => client.resetStore()}
      onSignedOutHook={() => client.resetStore()}
    />
  )
};

registerComponent('UsersAccountForm', UsersAccountForm, withApollo);

// customize Accounts.ui

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL',
});

class AccountsButton extends Accounts.ui.Button {
  render () {
    const {label, href, type, disabled, className, onClick} = this.props;
    if (type === 'link') {
      return <a href={ href } className={ className } onClick={ onClick }>{ label }</a>;
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

  render() {
    const { id, hint, /* label, */ type = 'text', onChange, className = "field", defaultValue = "", message } = this.props;
    const { mount = true } = this.state;
    return mount ? (
      <div className={ className }>
        <FormControl id={ id } type={ type } inputRef={ref => { this.input = ref; }} onChange={ onChange } placeholder={ hint } defaultValue={ defaultValue } />
        {message && (
          <span className={['message', message.type].join(' ').trim()}>
            {message.message}</span>
        )}
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
