import React, { PureComponent } from 'react';
import { withCurrentUser } from 'meteor/vulcan:core';
import { withRouter } from 'react-router';
import Users from 'meteor/vulcan:users';

export default function withAccess (options) {

  const { groups, redirect } = options;

  // we return a function that takes a component and itself returns a component
  return WrappedComponent => {
    class AccessComponent extends PureComponent {

      // if there are any groups defined check if user belongs, else just check if user exists
      canAccess = currentUser => {
        return groups ? Users.isMemberOf(currentUser, groups) : currentUser;
      }

      // redirect on constructor if user cannot access
      constructor(props) {
        super(props);
        if(!this.canAccess(props.currentUser) && typeof redirect === 'string') {
          props.router.push(redirect);
        }
      }

      render() {
        return this.canAccess(this.props.currentUser) ? <WrappedComponent {...this.props}/> : null;
      }
    }

    AccessComponent.displayName = `withAccess(${WrappedComponent.displayName})`;

    return withRouter(withCurrentUser(AccessComponent));
  }
}
