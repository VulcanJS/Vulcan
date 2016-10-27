import Telescope from 'meteor/nova:lib';
import React from 'react';
import { DocumentContainer } from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";

const PostsSingle = (props, context) => {
  return <Telescope.components.PostsPageContainer postId={props.params._id} />
};

PostsSingle.displayName = "PostsSingle";

module.exports = PostsSingle;