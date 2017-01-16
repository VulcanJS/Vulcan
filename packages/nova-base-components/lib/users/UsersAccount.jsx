import { Components, registerComponent } from 'meteor/nova:lib';
import React from 'react';
import { withCurrentUser } from 'meteor/nova:core';

const UsersAccount = (props, context) => {
  const terms = props.params.slug ? {slug: props.params.slug} : props.currentUser ? {userId: props.currentUser._id } : {};
  return <Components.UsersEditForm {...terms} />
};

UsersAccount.propTypes = {
  currentUser: React.PropTypes.object
};

UsersAccount.displayName = "UsersAccount";

registerComponent('UsersAccount', UsersAccount, withCurrentUser);