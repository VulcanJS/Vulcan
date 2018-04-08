import React from 'react'
import { verifyEmail, resendVerificationEmail } from 'meteor/vulcan:accounts2';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { registerComponent, withMessages } from 'meteor/vulcan:core';

class EmailVerification extends React.Component {

  async resend(event){
    event.preventDefault()

    let { email } = this.refs
    email = email.value

    try {
      const response = await resendVerificationEmail({ email }, this.props.client)
      this.props.flash(response, 'success')
    } catch (error) {
      this.props.flash(error)
    }
  }

  async componentDidMount() {
    let { data } = this.props
    let { token } = this.props.params

    if(token){
      try {
        const response = await verifyEmail({ token }, this.props.client)
        this.props.flash(response, 'success')
        data.refetch()
      } catch (error) {
        this.props.flash(error)
      }
    }
  }

  render() {
    let { me, loading } = this.props.data
    let { token } = this.props.params
    let verified = false
    if(me){
      verified = me.emails[0].verified
    }

    return (loading) ? (<p>Loading...</p>) : (
      <div>

        { (!token && !verified) ? <p>Please check your email account for a verification email.</p> : '' }

        { verified ? <p>Your email has been verified.</p> : '' }

        { (token && !verified) ? <p>Email could not be verified.</p> : '' }

        { !verified ? <form onSubmit={this.resend.bind(this)}>

          <label>Email: </label>
          <input
          defaultValue="user@example.com"
          type="email"
          ref="email" />
          <br />

          <button type="submit">Send</button>
        </form> : '' }

      </div>
    );
  }
}

const query = gql`
query getCurrentUser {
  me {
    emails {
      verified
    }
  }
}
`

registerComponent('AccountsEmailVerification', EmailVerification, withMessages, graphql(query));