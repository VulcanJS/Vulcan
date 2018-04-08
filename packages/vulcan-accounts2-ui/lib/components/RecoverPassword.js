import React from 'react'
import { resetPassword, forgotPassword } from 'meteor/vulcan:accounts2'
import { withApollo } from 'react-apollo';
import { registerComponent, withMessages } from 'meteor/vulcan:core';

class RecoverPassword extends React.Component {

  async reset(event){
    event.preventDefault()

    let { newPassword, repeatPassword } = this.refs
    let { token } = this.props.params
    newPassword = newPassword.value
    repeatPassword = repeatPassword.value

    if(newPassword === repeatPassword){
      try {
        const response = await resetPassword({ newPassword, token }, this.props.client)
        this.props.flash(response, 'success')
      } catch (error) {
        this.props.flash(error)
      }
    }else{
      this.props.flash('Passwords do not match.')      
    }
  }

  async forgot(event) {
    event.preventDefault()

    let { email } = this.refs
    email = email.value

    try {
      const response = await forgotPassword({ email }, this.props.client)
      this.props.flash(response, 'success')
    } catch (error) {
      this.props.flash(error)
    }
  }

  render() {
    let { token } = this.props.params

    return token ? <div>
      <p>Set your new password.</p>
      <form onSubmit={this.reset.bind(this)}>

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

        <button type="submit">Set Password</button>
      </form>
    </div> : <div>
      <p>Send password reset link.</p>
      <form onSubmit={this.forgot.bind(this)}>

        <label>Email: </label>
        <input
        defaultValue="user@example.com"
        type="email"
        required="true"
        ref="email" />
        <br />

        <button type="submit">Send Link</button>
      </form>
    </div>
  }
}

registerComponent('AccountsRecoverPassword', RecoverPassword, withMessages, withApollo);