import { addAdminColumn } from 'meteor/vulcan:core';

import AdminUsersName from '../components/users/columns/AdminUsersName.jsx';
import AdminUsersEmail from '../components/users/columns/AdminUsersEmail.jsx';
import AdminUsersCreated from '../components/users/columns/AdminUsersCreated.jsx';
import AdminUsersActions from '../components/users/columns/AdminUsersActions.jsx';

addAdminColumn([
  {
    name: 'users.name',
    order: 1,
    component: AdminUsersName
  },
  {
    name: 'users.email',
    order: 10,
    component: AdminUsersEmail
  },
  {
    name: 'users.created',
    order: 20,
    component: AdminUsersCreated
  },
  {
    name: 'users.actions',
    order: 100,
    component: AdminUsersActions
  },
]);