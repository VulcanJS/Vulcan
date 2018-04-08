import React from 'react'
import { changePassword } from 'meteor/vulcan:accounts2';
import { registerComponent, withMessages } from 'meteor/vulcan:core';
import { withRouter } from 'react-router';
import { withApollo } from 'react-apollo';

class ChangePassword extends React.Component {

  async change(event){
    event.preventDefault()

    let { oldPassword, newPassword, repeatPassword } = this.refs
    oldPassword = oldPassword.value
    newPassword = newPassword.value
    repeatPassword = repeatPassword.value

    if(newPassword === repeatPassword){
      try {
        const response = await changePassword({ oldPassword, newPassword }, this.props.client)
        this.props.flash(response, 'success')
        this.props.client.resetStore()
        this.props.router.push('/login')
      } catch (error) {
        this.props.flash(error)
      }
    }else{
      this.props.flash('Passwords do not match.')
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

registerComponent('AccountsChangePassword', ChangePassword, withMessages, withApollo, withRouter);
