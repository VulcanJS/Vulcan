import { Components, replaceComponent, withCurrentUser } from 'meteor/vulcan:core';
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const PostsNewButton = (props, context) => {

  return (
    <Button className="posts-new-button" bsStyle="primary"> New Post </Button>
  )
}

PostsNewButton.displayName = 'PostsNewButton';

replaceComponent('PostsNewButton', PostsNewButton, withCurrentUser);
