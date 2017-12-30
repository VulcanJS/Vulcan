import React, { PureComponent } from 'react';
import { withCurrentUser } from 'meteor/vulcan:core';
import { withRouter } from 'react-router';
import Users from 'meteor/vulcan:users';

export default function withAccess (options) {
  
  const { groups, redirect } = options;

  return WrappedComponent => {
    class AccessComponent extends PureComponent {

      // if there are any groups defined check if user belongs, else just check if user exists
      canAcces = currentUser => {
        return groups ? currentUser && Users.isMemberOf(props.currentUser, groups) : currentUser;
      }

      // redirect on constructor if user cannot access
      constructor(props) {
        super(props);
        if(!this.canAcces(props.currentUser)) {
          props.router.push(redirect);
        }
      }
    
      render() {
        return this.canAcces(this.props.currentUser) ? <WrappedComponent/> : null;
      }
    }

    AccessComponent.displayName = `withAccess(${WrappedComponent.displayName})`;

    return withRouter(withCurrentUser(AccessComponent));
  }
}
