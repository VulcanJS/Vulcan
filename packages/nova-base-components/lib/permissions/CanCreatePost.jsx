import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';

const CanCreatePost = (props, context) => {

  const currentUser = context.currentUser;

  const children = props.children;
  const UsersAccountForm = Telescope.components.UsersAccountForm;

  if (!currentUser){
    return (
      <div className="log-in-message">
        <h3><FormattedMessage id="users.please_log_in"/></h3>
        <UsersAccountForm/>
      </div>
    )
  } else if (Users.can.post(currentUser)) {
    return children;
  } else {
    return <p><FormattedMessage id="users.cannot_post"/></p>;
  }
};

CanCreatePost.contextTypes = {
  currentUser: React.PropTypes.object
};

CanCreatePost.displayName = "CanCreatePost";

module.exports = CanCreatePost;