import React, { PropTypes, Component } from 'react';
import Users from 'meteor/nova:users';

const CanEditPost = ({user, post, children}) => {
  if (Users.can.edit(user, post)) {
    return children;
  } else if (!user){
    return <p>Please log in.</p>;
  } else {
    return <p>Sorry, you do not have permissions to edit this post at this time</p>;
  }
};

CanEditPost.propTypes = {
  user: React.PropTypes.object,
  post: React.PropTypes.object
}

CanEditPost.displayName = "CanEditPost";

module.exports = CanEditPost;