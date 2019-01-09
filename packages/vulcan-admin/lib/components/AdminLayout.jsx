/**
 * @Author: Apollinaire Lecocq <apollinaire>
 * @Date:   08-01-19
 * @Last modified by:   apollinaire
 * @Last modified time: 09-01-19
 */
import React from 'react';
import {registerComponent, Components, withAccess} from 'meteor/vulcan:core';

// we need a component to wrap the `withAccess` hoc around something
function EmptyComponent({children}) {
  return children;
}
EmptyComponent.displayName = 'EmptyComponent';

const RestrictToAdmins = withAccess({groups: ['admins']})(EmptyComponent);

/**
 * A simple component that renders the existing layout and checks wether the currentUser is an admin or not.
 */

function AdminLayout({children}) {
  return (
    <Components.Layout>
      <RestrictToAdmins>{children}</RestrictToAdmins>
    </Components.Layout>
  );
}

registerComponent({
  name: 'AdminLayout',
  component: AdminLayout,
});
