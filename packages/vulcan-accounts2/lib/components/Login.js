import React from 'react'
import { loginWithPassword } from 'meteor-apollo-accounts'
import { ApolloClient, Notification } from './index'
import { browserHistory } from 'react-router'

class Login extends React.Component {

  async login(event) {
    event.preventDefault();

    let { data } = this.props
    let { email, password } = this.refs
    email = email.value
    password = password.value

    try {
      const response = await loginWithPassword({ email, password }, ApolloClient)
      Notification.success(response)
      ApolloClient.resetStore()
      browserHistory.push('/')
    } catch (error) {
      Notification.error(error)
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.login.bind(this)}>
          <label>Email: </label>
          <input
          defaultValue="admin@example.com"
          type="email"
          ref="email" />
          <br />

          <label>Password: </label>
          <input
          defaultValue="password"
          type="password"
          ref="password" />
          <br />

          <button type="submit">Login</button>
        </form>
      </div>
    )
  }
}

export default Login
