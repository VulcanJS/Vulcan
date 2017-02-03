import { Components, registerComponent } from 'meteor/nova:core';
import React from 'react';

const UsersSingle = (props, context) => {
  return <Components.UsersProfile userId={props.params._id} slug={props.params.slug} />
};

UsersSingle.displayName = "UsersSingle";

registerComponent('UsersSingle', UsersSingle);
