import { addAdminColumn } from 'meteor/vulcan:core';

import AdminUsersName from '../components/users/columns/AdminUsersName.jsx';
import AdminUsersEmail from '../components/users/columns/AdminUsersEmail.jsx';
import AdminUsersCreated from '../components/users/columns/AdminUsersCreated.jsx';
import AdminUsersActions from '../components/users/columns/AdminUsersActions.jsx';

addAdminColumn([
  {
    name: 'name',
    order: 1,
    component: AdminUsersName
  },
  {
    name: 'email',
    order: 10,
    component: AdminUsersEmail
  },
  {
    name: 'created',
    order: 20,
    component: AdminUsersCreated
  },
  {
    name: 'actions',
    order: 100,
    component: AdminUsersActions
  },
]);