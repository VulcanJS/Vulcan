import React, { PropTypes, Component } from 'react';

const CanCreatePost = (props, context) => {

  const currentUser = context.currentUser;

  const children = props.children;
  const UsersAccountForm = Telescope.components.UsersAccountForm;

  if (!currentUser){
    return (
      <div className="log-in-message">
        <h3>Please Log In</h3>
        <UsersAccountForm/>
      </div>
    )
  } else if (Users.can.post(currentUser)) {
    return children;
  } else {
    return <p>Sorry, you do not have permissions to post at this time</p>;
  }
};

CanCreatePost.contextTypes = {
  currentUser: React.PropTypes.object
};

CanCreatePost.displayName = "CanCreatePost";

module.exports = CanCreatePost;