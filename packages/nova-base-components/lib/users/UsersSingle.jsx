import React from 'react';
import { DocumentContainer } from "meteor/utilities:react-list-container";
import Users from 'meteor/nova:users';

const UsersSingle = (props, context) => {
  return (
    <DocumentContainer 
      collection={Users} 
      publication="users.single" 
      selector={{'telescope.slug': props.params.slug}}
      terms={{'telescope.slug': props.params.slug}}
      component={Telescope.components.UsersProfile}
      documentPropName="user"
    />
  )
};

UsersSingle.displayName = "PostsSingle";

module.exports = UsersSingle;