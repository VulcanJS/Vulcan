import { Components, registerComponent } from 'meteor/nova:lib';
import React from 'react';
import Users from 'meteor/nova:users';

const UsersSingle = (props, context) => {
  return <Components.UsersProfile userId={props.params._id} slug={props.params.slug} />
};

UsersSingle.displayName = "UsersSingle";

registerComponent('UsersSingle', UsersSingle);