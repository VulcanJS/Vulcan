/*

Admin dashboard extension

*/

import { extendFragment, addAdminColumn, addStrings } from 'meteor/vulcan:core';
import AdminUsersPosts from '../../components/admin/AdminUsersPosts';

extendFragment('UsersAdmin', `
  posts(limit: 5){
    ...PostsPage
  }
`);

addAdminColumn({
  name: 'posts',
  order: 50,
  component: AdminUsersPosts
});


addStrings('en', {
  'admin.users.posts': 'Posts',
});