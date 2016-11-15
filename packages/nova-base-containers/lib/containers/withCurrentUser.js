import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { Meteor } from 'meteor/meteor';
import { withApollo } from 'react-apollo';
import Telescope from 'meteor/nova:lib';

/**
 * withCurrentUser - HOC to give access to the currentUser as a prop of a WrappedComponent
 * note: it uses withApollo HOC to get the store
 **/
export default function withCurrentUser(WrappedComponent) {

  const WithCurrentUser = (props, context) => {

    const {client, ...otherProps} = props; 

    const currentUser = client ? client.store.getState().apollo.data[`User${Meteor.userId()}`] : null;

    return currentUser ? <WrappedComponent currentUser={currentUser} {...otherProps} /> : <WrappedComponent {...otherProps} />;
  }

  WithCurrentUser.displayName = `withCurrentUser(${Telescope.utils.getComponentDisplayName(WrappedComponent)}`;
  WithCurrentUser.WrappedComponent = WrappedComponent;

  return hoistStatics(withApollo(WithCurrentUser), WrappedComponent);
}