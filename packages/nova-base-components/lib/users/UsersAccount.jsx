import React from 'react';
import { DocumentContainer } from "meteor/utilities:react-list-container";
import Users from 'meteor/nova:users';

const UsersAccount = (props, context) => {
  const terms = props.params.slug ? {"telescope.slug": props.params.slug} : {_id: context.currentUser._id};
  return (
    <DocumentContainer 
      collection={Users} 
      publication="users.single" 
      selector={terms} 
      terms={terms}
      documentPropName="user"
      component={Telescope.components.UsersEdit}
    />
  )
};

UsersAccount.contextTypes = {
  currentUser: React.PropTypes.object
}

UsersAccount.displayName = "PostsSingle";

module.exports = UsersAccount;