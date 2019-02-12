import React, {PureComponent} from 'react';
import {Components} from 'meteor/vulcan:lib';
import withCurrentUser from './withCurrentUser';
import {withRouter} from 'react-router';
import Users from 'meteor/vulcan:users';

/**
 * withAccess - description
 *
 * @param  {Object}    options                      the options that define the hoc
 * @param  {string[]}  options.groups               the groups that have access to this component
 * @param  {string}    options.redirect             the link to redirect to in case the access is not granted (optional)
 * @param  {string}    options.failureComponentName the name of a component to display if access is not granted (optional)
 * @param  {Component} options.failureComponent     the component to display if access is not granted (optional)
 * @return {PureComponent}                          a React component that will display only if the acces is granted
 */

export default function withAccess(options) {
  const {
    groups = [],
    redirect = null,
    failureComponent = null,
    failureComponentName = null,
  } = options;

  // we return a function that takes a component and itself returns a component
  return WrappedComponent => {
    class AccessComponent extends PureComponent {
      // if there are any groups defined check if user belongs, else just check if user exists
      canAccess = currentUser => {
        return groups ? Users.isMemberOf(currentUser, groups) : currentUser;
      };

      // redirect on constructor if user cannot access
      constructor(props) {
        super(props);
        if (
          !this.canAccess(props.currentUser) &&
          typeof redirect === 'string'
        ) {
          props.history.push(redirect);
        }
      }

      renderFailureComponent() {
        if (failureComponentName) {
          const FailureComponent = Components[failureComponentName];
          return <FailureComponent {...this.props} />;
        } else if (failureComponent) {
          const FailureComponent = failureComponent; // necesary because jsx components must be uppercase
          return <FailureComponent {...this.props} />;
        } else return null;
      }

      render() {
        return this.canAccess(this.props.currentUser) ? (
          <WrappedComponent {...this.props} />
        ) : (
          this.renderFailureComponent()
        );
      }
    }

    AccessComponent.displayName = `withAccess(${WrappedComponent.displayName})`;

    return withRouter(withCurrentUser(AccessComponent));
  };
}
