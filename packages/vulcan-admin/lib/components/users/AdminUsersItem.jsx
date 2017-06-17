import React, { PureComponent } from 'react';
import { Components, AdminColumns } from 'meteor/vulcan:core';

const AdminUsersItem = ({ user }) => {
  return (
  <tr className="admin-users-item">
    {_.sortBy(AdminColumns, column => column.order).map(column => {
      const Component = column.component || Components[column.componentName];
      return <td key={column.name} className={`admin-users-item-${column.name}`}><Component user={user} /></td>
    })}
  </tr>
  )
}
export default AdminUsersItem;