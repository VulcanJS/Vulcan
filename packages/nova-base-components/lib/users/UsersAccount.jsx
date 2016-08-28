import Telescope from 'meteor/nova:lib';
import React from 'react';
import { DocumentContainer } from "meteor/utilities:react-list-container";
import Users from 'meteor/nova:users';

const UsersAccount = (props, context) => {
  const terms = props.params.slug ? {"telescope.slug": props.params.slug} : context.currentUser ? {_id: context.currentUser._id } : undefined;
  return (
    <Telescope.components.CanDo action="users.edit.own" displayNoPermissionMessage={true}>
      <DocumentContainer 
        collection={Users} 
        publication="users.single" 
        selector={terms} 
        terms={terms}
        documentPropName="user"
        component={Telescope.components.UsersEdit}
      />
    </Telescope.components.CanDo>
  )
};

UsersAccount.contextTypes = {
  currentUser: React.PropTypes.object
}

UsersAccount.displayName = "UsersAccount";

module.exports = UsersAccount;