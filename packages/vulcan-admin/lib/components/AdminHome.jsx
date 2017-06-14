import React from 'react';
import { Components, withCurrentUser } from 'meteor/vulcan:core';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import Users from 'meteor/vulcan:users';

import AdminUsers from './users/AdminUsers.jsx';

const AdminHome = ({ currentUser }) =>
  <div className="admin-home page">
    <Components.ShowIf check={Users.isAdmin} document={currentUser} failureComponent={<p className="admin-home-message"><FormattedMessage id="app.noPermission" /></p>}>
      <AdminUsers />
    </Components.ShowIf>
  </div>

export default withCurrentUser(AdminHome);