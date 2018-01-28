/*

Declare permissions for the pics collection.

*/

import Users from 'meteor/vulcan:users';

Users.groups.guests.cannot(['pics.view']);

Users.createGroup('customers');
const customersActions = [
  'pics.view',
  'pics.new',
  'pics.edit.own',
  'pics.remove.own',
];
Users.groups.customers.can(customersActions);

const adminActions = [
  'pics.view',
  'pics.new',
  'pics.edit.all',
  'pics.remove.all'
];
Users.groups.admins.can(adminActions);
