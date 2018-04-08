import React from 'react'
import { createUser } from 'meteor/vulcan:accounts2'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router'
import { withApollo } from 'react-apollo';
import { registerComponent, withMessages } from 'meteor/vulcan:core';

class Register extends React.Component {

  async register(event) {
    event.preventDefault();

    let { client, data, updateProfile } = this.props
    let { firstname, lastname, email, password } = this.refs
    let profile = {
      firstname: firstname.value,
      lastname: lastname.value,
      name: `${firstname.value} ${lastname.value}`
    }
    email = email.value
    password = password.value

    try {
      const response = await createUser({email, password, profile}, this.props.client)
      this.props.flash(response, 'success')
      browserHistory.push('/email-verification')
      this.props.client.resetStore()
    } catch (error) {
      this.props.flash(error)
    }
  }

  render() {
    return (
      <div>
          <form onSubmit={this.register.bind(this)}>
              <label>Firstname: </label>
              <input
              defaultValue="John"
              type="text"
              required="true"
              ref="firstname" />
              <br />

              <label>Lastname: </label>
              <input
              defaultValue="Smith"
              type="text"
              required="true"
              ref="lastname" />
              <br />

              <label>Email: </label>
              <input
              defaultValue="user@example.com"
              type="email"
              required="true"
              ref="email" />
              <br />

              <label>Password: </label>
              <input
              defaultValue="password"
              type="password"
              required="true"
              ref="password" />
              <br />

              <button type="submit">Register</button>
          </form>
      </div>
    );
  }
}

export default Register

registerComponent('AccountsRegister', Register, withApollo, withMessages);