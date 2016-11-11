import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import Posts from "meteor/nova:posts";
import Users from "meteor/nova:users";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default function withUsersSingle (getParams) {
  return graphql(gql`
    query getUser($userId: String, $slug: String) {
      user(_id: $userId, slug: $slug) {
        ${Users.graphQLQueries.single}
      }
    }
    `, {
    options(ownProps) {
      
      const finalProps = getParams ? getParams(ownProps) : ownProps;
      return {
        variables: { userId: finalProps.userId, slug: finalProps.slug },
        // pollInterval: 20000,
      };
    },
  });
}

module.exports = withUsersSingle;