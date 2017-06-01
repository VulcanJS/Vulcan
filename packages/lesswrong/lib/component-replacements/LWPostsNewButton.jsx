import { Components, replaceComponent, withCurrentUser } from 'meteor/vulcan:core';
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import { Button } from 'react-bootstrap';

const PostsNewButton = (props, context) => {

  return (
    <Button className="posts-new-button" bsStyle="primary"> <FormattedMessage id="posts.new_post"/></Button>
  )
}

PostsNewButton.displayName = 'PostsNewButton';

replaceComponent('PostsNewButton', PostsNewButton, withCurrentUser);
