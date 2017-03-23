import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import { Button } from 'react-bootstrap';

const PostsNewButton = (props, context) => {

  const size = props.currentUser ? "large" : "small";
  const button = <Button className="posts-new-button" bsStyle="primary"><FormattedMessage id="posts.new_post"/></Button>;
  return (
    <Components.ModalTrigger size={size} title={context.intl.formatMessage({id: "posts.new_post"})} component={button}>
      <Components.PostsNewForm />
    </Components.ModalTrigger>
  )
}

PostsNewButton.displayName = "PostsNewButton";

PostsNewButton.propTypes = {
  currentUser: React.PropTypes.object,
};

PostsNewButton.contextTypes = {
  messages: React.PropTypes.object,
  intl: intlShape
};

registerComponent('PostsNewButton', PostsNewButton, withCurrentUser);
