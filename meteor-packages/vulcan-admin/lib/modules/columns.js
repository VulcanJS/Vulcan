import { addAdminColumn } from 'meteor/vulcan:core';

import AdminUsersName from '../components/users/columns/AdminUsersName.jsx';
import AdminUsersEmail from '../components/users/columns/AdminUsersEmail.jsx';
import AdminUsersCreated from '../components/users/columns/AdminUsersCreated.jsx';

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
]);