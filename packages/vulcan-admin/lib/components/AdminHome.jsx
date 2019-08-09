import React from 'react';
import { Components, withCurrentUser, AdminColumns } from 'meteor/vulcan:core';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import Users from 'meteor/vulcan:users';

import '../modules/columns.js';

const AdminHome = ({ currentUser }) =>
  <div className="admin-home page">
    <Components.ShowIf check={Users.isAdmin} document={currentUser} failureComponent={<p className="admin-home-message"><FormattedMessage id="app.noPermission" /></p>}>
      <Components.Datatable 
        collection={Users} 
        columns={AdminColumns} 
        options={{
          fragmentName: 'UsersAdmin',
          terms: {view: 'usersAdmin'},
          limit: 20
        }}
        title="Users"
        showEdit={true}
        showPaper={true}
      />
    </Components.ShowIf>
  </div>;

export default withCurrentUser(AdminHome);
