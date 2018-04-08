import React from 'react'
import { verifyEmail, resendVerificationEmail } from 'meteor-apollo-accounts'
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { ApolloClient, Notification } from './index'

class EmailVerification extends React.Component {

  async resend(event){
    event.preventDefault()

    let { email } = this.refs
    email = email.value

    try {
      const response = await resendVerificationEmail({ email }, ApolloClient)
      Notification.success(response)
    } catch (error) {
      Notification.error(error)
    }
  }

  async componentDidMount() {
    let { data } = this.props
    let { token } = this.props.params

    if(token){
      try {
        const response = await verifyEmail({ token }, ApolloClient)
        Notification.success(response)
        data.refetch()
      } catch (error) {
        Notification.error(error)
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
EmailVerification = graphql(query)(EmailVerification)

export default EmailVerification
