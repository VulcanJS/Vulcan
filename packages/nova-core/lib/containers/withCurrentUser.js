import React, { Component, PropTypes } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { Meteor } from 'meteor/meteor';
import { Utils } from 'meteor/nova:lib';

/**
 * withCurrentUser - HOC to give access to the currentUser as a prop of a WrappedComponent
 **/
function withCurrentUser(WrappedComponent) {

  class WithCurrentUser extends Component {
    constructor(...args) {
      super(...args);
      this.logCurrentUser = this.logCurrentUser.bind(this);
    }
    
    logCurrentUser() {
      console.log('currentUser', this.context.client.store.getState().apollo.data[`User${Meteor.userId()}`])
    }

    render() {
      const {client} = this.context; // grab the apollo client from the context

      const currentUser = client ? client.store.getState().apollo.data[`User${Meteor.userId()}`] : null;

      console.log('// withCurrentUser render: '+Utils.getComponentDisplayName(WrappedComponent))
      console.log(currentUser)

      return currentUser ? <WrappedComponent currentUser={currentUser} {...this.props} /> : <WrappedComponent {...this.props} />;
    }
  }

  WithCurrentUser.contextTypes = { client: PropTypes.object.isRequired };
  WithCurrentUser.displayName = `withCurrentUser(${Utils.getComponentDisplayName(WrappedComponent)}`;
  WithCurrentUser.WrappedComponent = WrappedComponent;

  return hoistStatics(WithCurrentUser, WrappedComponent);
}

import Users from 'meteor/nova:users';   
import { graphql } from 'react-apollo';   
import gql from 'graphql-tag';    
    
const loadCurrentUser = component => {    
    
  const preloadedFields = _.compact(_.map(Users.simpleSchema()._schema, (field, fieldName) => {   
    return field.preload ? fieldName : undefined;   
  }));    
      
  // console.log('preloaded fields', preloadedFields);    
    
  return graphql(   
    gql`query getCurrentUser {    
      currentUser {   
        ${preloadedFields.join('\n')}   
      }   
    }   
    `, {    
      props(props) {    
        const {data: {loading, currentUser}} = props;   
        return {    
          loading,    
          currentUser,    
        };    
      },    
    }   
  )(component);   
};    

export default loadCurrentUser;
