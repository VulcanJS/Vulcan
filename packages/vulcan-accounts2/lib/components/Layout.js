import React from 'react'
import { logout } from 'meteor-apollo-accounts'
import { Link } from 'react-router'
import { ApolloClient, Notification } from './index'
import { browserHistory } from 'react-router'

class Layout extends React.Component {

  async logout(event) {
    event.preventDefault()

    let { client, data } = this.props

    try {
      const response = await logout(ApolloClient)
      Notification.success(response)
      ApolloClient.resetStore()
      browserHistory.push('/login')
    } catch (error) {
      Notification.error(error)
    }
  }

  render() {
      return (
        <div>
          <h1><Link to={'/'}>App</Link></h1>
          <ul className="navigation">
            <li><Link to={`/posts`}>Posts</Link></li>
            <li><Link to={`/login`}>Login</Link></li>
            <li><Link to={`/social-login`}>Social Login</Link></li>
            <li><Link onClick={this.logout.bind(this)}>Logout</Link></li>
            <li><Link to={`/register`}>Register</Link></li>
            <li><Link to={`/email-verification`}>Email Verification</Link></li>
            <li><Link to={`/profile`}>Profile</Link></li>
            <li><Link to={`/change-password`}>Change Password</Link></li>
            <li><Link to={`/recover-password`}>Recover Password</Link></li>
          </ul>
          {this.props.children}
        </div>
      );
    }
}

export default Layout
