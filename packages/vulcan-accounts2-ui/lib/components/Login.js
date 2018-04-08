import React from 'react';
import { loginWithPassword } from 'meteor/vulcan:accounts2';
import { browserHistory } from 'react-router';
import { withApollo } from 'react-apollo';
import { registerComponent, withMessages } from 'meteor/vulcan:core';

class Login extends React.Component {
  async login(event) {
    event.preventDefault();

    let { data } = this.props;
    let { email, password } = this.refs;
    email = email.value;
    password = password.value;

    try {
      const response = await loginWithPassword({ email, password }, this.props.client);
      console.log(response)
      this.props.flash(response, 'success');
      this.props.client.resetStore();
      browserHistory.push('/');
    } catch (error) {
      this.props.flash(error.message);
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.login.bind(this)}>
          <label>Email: </label>
          <input defaultValue="admin@example.com" type="email" ref="email" />
          <br />

          <label>Password: </label>
          <input defaultValue="password" type="password" ref="password" />
          <br />

          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

registerComponent('AccountsLogin', Login, withMessages, withApollo);
