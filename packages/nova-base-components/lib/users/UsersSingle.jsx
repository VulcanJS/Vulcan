import Telescope from 'meteor/nova:lib';
import React from 'react';
import Users from 'meteor/nova:users';

const UsersSingle = (props, context) => {
  return <Telescope.components.UsersSingleContainer userId={props.params._id} slug={props.params.slug} component={Telescope.components.UsersProfile} />
};

UsersSingle.displayName = "UsersSingle";

module.exports = UsersSingle;