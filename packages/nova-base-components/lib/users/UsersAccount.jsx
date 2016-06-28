import React from 'react';
import { DocumentContainer } from "meteor/utilities:react-list-container";
import Users from 'meteor/nova:users';

const UsersAccount = (props, context) => {
  const params = props.params.slug ? props.params : {_id: context.currentUser._id};
  return (
    <DocumentContainer 
      collection={Users} 
      publication="users.single" 
      selector={params} 
      terms={params} 
      component={Telescope.components.UsersEdit}
    />
  )
};

UsersAccount.contextTypes = {
  currentUser: React.PropTypes.object
}

UsersAccount.displayName = "PostsSingle";

module.exports = UsersAccount;