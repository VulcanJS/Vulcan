import React from 'react';
import { logout } from 'meteor/vulcan:accounts2';
import { browserHistory } from 'react-router';
import { withApollo } from 'react-apollo';
import { registerComponent, withMessages } from 'meteor/vulcan:core';

class Logout extends React.Component {
  logout = async (event) => {
    event.preventDefault();

    try {
      const response = await logout(this.props.client);
      console.log(response);
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
        <button onClick={this.logout}>Logout</button>
      </div>
    );
  }
}

registerComponent('AccountsLogout', Logout, withMessages, withApollo);
