/**
 * @summary Telescope Users namespace
 * @namespace Users
 */
const Users = Meteor.users;

Telescope.subscriptions.preload("users.current");

export default Users;