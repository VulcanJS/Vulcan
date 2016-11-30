import React, { Component, PropTypes } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { Meteor } from 'meteor/meteor';
import Telescope from 'meteor/nova:lib';

/**
 * withCurrentUser - HOC to give access to the currentUser as a prop of a WrappedComponent
 **/
export default function withCurrentUser(WrappedComponent) {

  class WithCurrentUser extends Component {
    constructor(...args) {
      super(...args);
    }
    
    render() {
      const {client} = this.context; // grab the apollo client from the context

      const currentUser = client ? client.store.getState().apollo.data[`User${Meteor.userId()}`] : null;

      return currentUser ? <WrappedComponent currentUser={currentUser} {...this.props} /> : <WrappedComponent {...this.props} />;
    }
  }

  WithCurrentUser.contextTypes = { client: PropTypes.object.isRequired };
  WithCurrentUser.displayName = `withCurrentUser(${Telescope.utils.getComponentDisplayName(WrappedComponent)}`;
  WithCurrentUser.WrappedComponent = WrappedComponent;

  return hoistStatics(WithCurrentUser, WrappedComponent);
}