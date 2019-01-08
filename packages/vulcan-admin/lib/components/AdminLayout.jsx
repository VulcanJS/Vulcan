/**
 * @Author: Apollinaire Lecocq <apollinaire>
 * @Date:   08-01-19
 * @Last modified by:   apollinaire
 * @Last modified time: 08-01-19
 */
import React from 'react';
import {
  registerComponent,
  Components,
  withCurrentUser,
} from 'meteor/vulcan:core';

/**
 * A simple component that renders the existing layout and checks wether the currentUser is an admin or not.
 */

class AdminLayout extends React.PureComponent {
  renderWithRestrictedAccess(children, currentUser) {
    // while the currentUser is loading, don't render anything.
    if (currentUserLoading) {
      return null;
    } //if the currentUser is an admin, then render the children
    else if (currentUser && currentUser.isAdmin) {
      return children;
    } // for every other case (just a member or not logged), render the 404 message
    return <Components.Error404 />;
  }

  render() {
    const {currentUser, children} = this.props;
    return (
      <Components.Layout>
        {this.renderWithRestrictedAccess(children, currentUser)}
      </Components.Layout>
    );
  }
}

registerComponent({
  name: 'AdminLayout',
  component: AdminLayout,
  hocs: [withCurrentUser],
});
