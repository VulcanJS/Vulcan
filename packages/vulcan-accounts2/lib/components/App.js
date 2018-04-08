import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { PostList } from './index'

class App extends React.Component {

  render() {
    let { me, loading } = this.props.data

    return loading ? (<p>Loading...</p>) : (
      <div>
        { me ? <p>Hi {me.profile.name}, you are logged in.</p> : <p>You are logged out.</p> }
        { (me && !me.emails[0].verified) ? <p>Please verify your email address.</p> : ''}
        { me ? (
          <PostList />
        ) : '' }
      </div>
    )
  }
}

const query = gql`
query getCurrentUser {
  me {
    profile {
      name
    }
    emails {
      verified
    }
  }
}
`
App = graphql(query)(App)

export default App
