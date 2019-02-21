/**
 * @Author: Apollinaire Lecocq <apollinaire>
 * @Date:   08-01-19
 * @Last modified by:   apollinaire
 * @Last modified time: 10-01-19
 */
import React from 'react';
import {registerComponent, Components, withAccess, Dummy} from 'meteor/vulcan:core';

const RestrictToAdmins = withAccess({groups: ['admins']})(Dummy);

/**
 * A simple component that renders the existing layout and checks whether the currentUser is an admin or not.
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
