import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import { Button } from 'react-bootstrap';
import { ModalTrigger } from "meteor/nova:core";

const PostsNewButton = (props, context) => {

  const size = context.currentUser ? "large" : "small";
  const button = <Button className="posts-new-button" bsStyle="primary"><FormattedMessage id="posts.new_post"/></Button>;
  return (
    <ModalTrigger size={size} title={context.intl.formatMessage({id: "posts.new_post"})} component={button}>
      <Telescope.components.PostsNewForm/>
    </ModalTrigger>
  )
}

PostsNewButton.displayName = "PostsNewButton";

PostsNewButton.contextTypes = {
  currentUser: React.PropTypes.object,
  messages: React.PropTypes.object,
  intl: intlShape
}

module.exports = PostsNewButton;
export default PostsNewButton;