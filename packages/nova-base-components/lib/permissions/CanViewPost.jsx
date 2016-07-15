import React, { PropTypes, Component } from 'react';
import Users from 'meteor/nova:users';

const CanViewPost = ({user, post, children}) => {
  if (Users.can.viewPost(this.props.user, this.props.document)) {
    return this.props.children;
  } else if (!this.props.user){
    return <p>Please log in.</p>;
  } else {
    return <p>Sorry, you do not have permissions to post at this time</p>;
  }
};

CanViewPost.propTypes = {
  user: React.PropTypes.object,
  post: React.PropTypes.object
}

CanViewPost.displayName = "CanViewPost";

module.exports = CanViewPost;