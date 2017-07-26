/*

Declare permissions for the pics collection.

*/

import Users from 'meteor/vulcan:users';

Users.createGroup('customers');
Users.groups.customers.can(['pics.view']);