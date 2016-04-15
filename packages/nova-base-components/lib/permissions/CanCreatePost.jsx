import React, { PropTypes, Component } from 'react';

const CanCreatePost = (props, context) => {

  const currentUser = context.currentUser;

  const children = props.children;
  const AccountsForm = Telescope.components.AccountsForm;

  if (!currentUser){
    return (
      <div>
        <h3>Please Log In</h3>
        <AccountsForm/>
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

module.exports = CanCreatePost;