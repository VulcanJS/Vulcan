import Telescope from 'meteor/nova:lib';
import React from 'react';
import Posts from "meteor/nova:posts";
import Users from "meteor/nova:users";

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const UsersSingleContainer = (props, context) => {

  const {loading, user, refetch} = props.data;
  const Component = props.component

  return loading ? <Telescope.components.Loading/> : <Component 
    document={user}
    refetchQuery={refetch}
    {...props.componentProps}
  />;
};

UsersSingleContainer.propTypes = {
  data: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    user: React.PropTypes.object,
  }).isRequired,
  params: React.PropTypes.object
};

UsersSingleContainer.contextTypes = {
  currentUser: React.PropTypes.object
};

UsersSingleContainer.displayName = "UsersSingleContainer";

const UsersSingleContainerWithData = graphql(gql`
  query getUser($userId: String, $slug: String) {
    user(_id: $userId, slug: $slug) {
      ${Users.graphQLQueries.single}
    }
  }
  `, {
  options(ownProps) {
    return {
      variables: { userId: ownProps.userId, slug: ownProps.slug },
      // pollInterval: 20000,
    };
  },
})(UsersSingleContainer);

module.exports = UsersSingleContainerWithData;