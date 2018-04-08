import React, { PureComponent } from 'react';
import { Utils, Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';

class AccountsUI extends PureComponent {
  state = {
    uiState: this.props.currentUser ? 'loggedIn' : 'logIn',
  };

  switchState = uiState => {
    this.setState({ uiState });
  };

  renderLoggedIn = () => (
    <div>
      <p>Welcome, {this.props.currentUser.displayName}</p>
      <a href="javascript:void(0)" onClick={() => this.switchState('changePassword')}>
        Change Password
      </a>
      <Components.AccountsLogout />
    </div>
  );

  renderLogIn = () => (
    <div>
      <a href="javascript:void(0)" onClick={() => this.switchState('login')}>
        Login
      </a>
      <a href="javascript:void(0)" onClick={() => this.switchState('register')}>
        Register
      </a>
      <Components.AccountsLogin />
      <a href="javascript:void(0)" onClick={() => this.switchState('forgotPassword')}>
        Forgot Password
      </a>
    </div>
  );

  renderRegister = () => (
    <div>
      <a href="javascript:void(0)" onClick={() => this.switchState('login')}>
        Login
      </a>
      <a href="javascript:void(0)" onClick={() => this.switchState('register')}>
        Register
      </a>
      <Components.AccountsRegister />
    </div>
  );

  renderForgotPassword = () => (
    <div>
      <a href="javascript:void(0)" onClick={() => this.switchState('login')}>
        Login
      </a>
      <a href="javascript:void(0)" onClick={() => this.switchState('register')}>
        Register
      </a>
      <Components.AccountsForgotPassword />
    </div>
  );

  renderChangePassword = () => <Components.AccountsChangePassword />;

  render() {
    const { uiState } = this.state;

    return this[`render${Utils.capitalize(uiState)}`]();
  }
}

registerComponent('AccountsUI', AccountsUI, withCurrentUser);
