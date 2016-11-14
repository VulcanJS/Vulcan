import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import Posts from "meteor/nova:posts";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default function withPostsSingle (component, options) {
  return graphql(gql`
    query getPost($postId: String) {
      post(_id: $postId) {
        ...fullPostInfo
      }
    }
  `, {
    options(ownProps) {
      return {
        variables: { postId: ownProps.postId },
        fragments: Posts.fragments.full,
        // pollInterval: 20000,
      };
    },
  })(component);
}

module.exports = withPostsSingle;