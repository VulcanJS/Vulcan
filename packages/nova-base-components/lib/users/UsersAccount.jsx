import Telescope from 'meteor/nova:lib';
import React from 'react';
import Users from 'meteor/nova:users';

const UsersAccount = (props, context) => {
  const terms = props.params.slug ? {slug: props.params.slug} : context.currentUser ? {userId: context.currentUser._id } : {};
  return (
    <Telescope.components.CanDo action="users.edit.own" displayNoPermissionMessage={true}>
      <Telescope.components.UsersSingleContainer 
        component={Telescope.components.UsersEdit}
        {...terms}
      />
    </Telescope.components.CanDo>
  )
};

UsersAccount.contextTypes = {
  currentUser: React.PropTypes.object
}

UsersAccount.displayName = "UsersAccount";

module.exports = UsersAccount;