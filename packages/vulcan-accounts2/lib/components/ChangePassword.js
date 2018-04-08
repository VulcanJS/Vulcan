import React from 'react'
import { changePassword } from 'meteor-apollo-accounts'
import { ApolloClient, Notification } from './index'

class ChangePassword extends React.Component {

  async change(event){
    event.preventDefault()

    let { oldPassword, newPassword, repeatPassword } = this.refs
    oldPassword = oldPassword.value
    newPassword = newPassword.value
    repeatPassword = repeatPassword.value

    if(newPassword === repeatPassword){
      try {
        const response = await changePassword({ oldPassword, newPassword }, ApolloClient)
        Notification.success(response)
        ApolloClient.resetStore()
        browserHistory.push('/login')
      } catch (error) {
        Notification.error(error)
      }
    }else{
      Notification.error('Passwords do not match.')
    }
  }

  render() {
    return (
      <div>
        <p>Set your new password.</p>
        <form onSubmit={this.change.bind(this)}>

          <label>Old Password: </label>
          <input
          type="password"
          required="true"
          ref="oldPassword" />
          <br />

          <label>New Password: </label>
          <input
          type="password"
          required="true"
          ref="newPassword" />
          <br />

          <label>Repeat Password: </label>
          <input
          type="password"
          required="true"
          ref="repeatPassword" />
          <br />

          <button type="submit">Change Password</button>
        </form>
      </div>
    )
  }
}

export default ChangePassword
