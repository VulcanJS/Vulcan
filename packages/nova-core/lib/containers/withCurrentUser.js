import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { graphql } from 'react-apollo';   
import gql from 'graphql-tag';    
import { Utils } from 'meteor/nova:lib';
import Users from 'meteor/nova:users';   

/**
* withCurrentUser - HOC to give access to the currentUser as a prop of a WrappedComponent
**/
const withCurrentUser = WrappedComponent => {
  
  class WithCurrentUser extends Component {
    constructor(...args) {
      super(...args);
    }
    
    // uncomment for debugging/monitoring
    // componentWillUnmount() {
    //   console.log('unmounting', Utils.getComponentDisplayName(WrappedComponent));
    // }
    
    render() {
      
      const preloadedFields = Users.getPreloadedFields();
      
      const ComponentWithData = graphql(
        gql`query getCurrentUser {
          currentUser {
            ${preloadedFields.join('\n')}
          }
        }
        `, {
          options(ownProps) {
            return {
              variables: {},
              // pollInterval: 20000,
            };
          },
          props(props) {
            const {data: {loading, currentUser}} = props;
            return {
              loading,
              currentUser,
            };
          },
        }
      )(WrappedComponent);
      
      return <ComponentWithData {...this.props} />
    }
  }
  
  WithCurrentUser.displayName = `withCurrentUser(${Utils.getComponentDisplayName(WrappedComponent)})`
  WithCurrentUser.WrappedComponent = WrappedComponent
  
  return hoistStatics(WithCurrentUser, WrappedComponent);
};

export default withCurrentUser;


/**
 ************************** old pattern without executing a query **************************
 * withCurrentUser - HOC to give access to the currentUser as a prop of a WrappedComponent
 **/
 
function withCurrentUserWithoutQuery(WrappedComponent) {

  class WithCurrentUser extends React.Component {
    constructor(...args) {
      super(...args);
      this.logCurrentUser = this.logCurrentUser.bind(this);
    }

    render() {
      const {client} = this.context; // grab the apollo client from the context

      const currentUser = client ? client.store.getState().apollo.data[`User${Meteor.userId()}`] : null;

      return currentUser ? <WrappedComponent currentUser={currentUser} {...this.props} /> : <WrappedComponent {...this.props} />;
    }
  }

  WithCurrentUser.contextTypes = { client: React.PropTypes.object.isRequired };
  WithCurrentUser.displayName = `withCurrentUser(${Utils.getComponentDisplayName(WrappedComponent)}`;
  WithCurrentUser.WrappedComponent = WrappedComponent;

  return hoistStatics(WithCurrentUser, WrappedComponent);
}
