import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React from 'react';

const UsersAccount = (props, context) => {
  // note: terms is as the same as a document-shape the SmartForm edit-mode expects to receive
  const terms = props.params.slug ? {slug: props.params.slug} : props.currentUser ? {documentId: props.currentUser._id } : {};
  return <Components.UsersEditForm terms={terms} />
};

UsersAccount.propTypes = {
  currentUser: React.PropTypes.object
};

UsersAccount.displayName = "UsersAccount";

registerComponent('UsersAccount', UsersAccount, withCurrentUser);
