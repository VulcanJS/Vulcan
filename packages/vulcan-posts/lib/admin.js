import { extendFragment, addAdminColumn } from 'meteor/vulcan:core';
import AdminUsersPosts from './components/AdminUsersPosts';

extendFragment('UsersAdmin', `
  posts{
    ...PostsPage
  }
`);

addAdminColumn({
  name: 'users.posts',
  order: 50,
  component: AdminUsersPosts
});